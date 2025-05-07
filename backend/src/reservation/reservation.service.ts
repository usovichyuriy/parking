import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reservation } from 'db/models/reservation.model';
import { PROVIDERS_CONSTANTS } from 'src/database/providers.constants';
import { RESERVATION_RESPONSE_MESSAGES } from './constants/reservation-response.messages';
import { ReserveSpotDto } from './reserve-spot.dto';
import { ParkingSpot } from 'db/models/parking-spot.model';
import { PARKING_SPOT_RESPONSE_MESSAGES } from 'src/parking-spot/parking-spot-response.messages';
import { RESERVATION_STATUSES } from './constants/reservation-status.constants';

@Injectable()
class ReservationService {
  constructor(
    @Inject(PROVIDERS_CONSTANTS.RESERVATIONS_REPOSITORY)
    private reservationsRepository: typeof Reservation,
    @Inject(PROVIDERS_CONSTANTS.PARKING_SPOTS_REPOSITORY)
    private parkingSpotRepository: typeof ParkingSpot,
  ) {}

  private checkDateAndTime(date: string, time: string): boolean {
    const reservationDate = new Date(`${date}T${time}:00`);
    return reservationDate >= new Date();
  }

  async createReservation(
    reserveSpotBody: ReserveSpotDto,
    userId: number,
  ): Promise<Reservation> {
    const isSpotExists = !!(await this.parkingSpotRepository.findOne({
      where: { id: reserveSpotBody.spotId },
    }));

    if (!isSpotExists) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: PARKING_SPOT_RESPONSE_MESSAGES.NOT_FOUND,
      });
    }

    const activeReservation = await this.reservationsRepository.findOne({
      where: {
        parking_spot_number: reserveSpotBody.spotId,
        reserved_date: reserveSpotBody.reservedDate,
        reserved_time: reserveSpotBody.reservedTime,
      },
    });

    if (activeReservation) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        error: RESERVATION_RESPONSE_MESSAGES.NOT_POSSIBLE,
      });
    }

    const isReservationDateValid = this.checkDateAndTime(
      reserveSpotBody.reservedDate,
      reserveSpotBody.reservedTime,
    );

    if (!isReservationDateValid) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: RESERVATION_RESPONSE_MESSAGES.DATE_IS_NOT_VALID,
      });
    }

    return await this.reservationsRepository.create({
      id: undefined,
      user_id: userId,
      parking_spot_number: reserveSpotBody.spotId,
      reserved_date: reserveSpotBody.reservedDate,
      reserved_time: reserveSpotBody.reservedTime,
    });
  }

  private checkAccessToReservation(
    reservation: Reservation,
    userId: number,
  ): boolean {
    return reservation.dataValues.user_id === Number(userId);
  }

  async declineReservation(id: number, userId: number): Promise<void> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: RESERVATION_RESPONSE_MESSAGES.NOT_FOUND,
      });
    }

    const accessToReservation = this.checkAccessToReservation(
      reservation,
      userId,
    );

    if (!accessToReservation) {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        error: RESERVATION_RESPONSE_MESSAGES.NO_ACCESS,
      });
    }

    if (reservation.dataValues.status === RESERVATION_STATUSES.CANCELLED) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        error: RESERVATION_RESPONSE_MESSAGES.IS_ALREADY_CANCELLED,
      });
    }

    await reservation.update({ status: RESERVATION_STATUSES.CANCELLED });
  }

  async findUserReservations(
    user_id: number,
    authUserId: number,
  ): Promise<Reservation[]> {
    if (user_id !== Number(authUserId)) {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        error: RESERVATION_RESPONSE_MESSAGES.NO_ACCESS,
      });
    }

    return await this.reservationsRepository.findAll({
      where: { user_id },
    });
  }
}
export default ReservationService;

import { Inject, Injectable } from '@nestjs/common';
import { ParkingSpot } from 'db/models/parking-spot.model';
import { Reservation } from 'db/models/reservation.model';
import { PROVIDERS_CONSTANTS } from 'src/database/providers.constants';

@Injectable()
class ParkingSpotService {
  constructor(
    @Inject(PROVIDERS_CONSTANTS.PARKING_SPOTS_REPOSITORY)
    private parkingSpotsRepository: typeof ParkingSpot,
    @Inject(PROVIDERS_CONSTANTS.RESERVATIONS_REPOSITORY)
    private reservationsRepository: typeof Reservation,
  ) {}

  async getSpots(): Promise<ParkingSpot[]> {
    return await this.parkingSpotsRepository.findAll();
  }

  async getFreeTimeForSpot(
    id: number,
    reserved_date: string,
  ): Promise<string[]> {
    const reservations = await this.reservationsRepository.findAll({
      where: { parking_spot_number: id, reserved_date, status: 'booked' },
    });

    const reservedTime = new Set(
      reservations.map((reservation) =>
        Number(reservation.dataValues.reserved_time.split(':')[0]),
      ),
    );

    const availableTime: string[] = [];
    for (let i = 0; i < 24; i++) {
      if (!reservedTime.has(i)) {
        if (i < 10) {
          availableTime.push(`0${i}:00`);
        } else {
          availableTime.push(`${i}:00`);
        }
      }
    }
    return availableTime;
  }
}
export default ParkingSpotService;

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import ReservationService from './reservation.service';
import { ReserveSpotDto } from './reserve-spot.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Reservation } from 'db/models/reservation.model';

@UseGuards(AuthGuard)
@Controller('reservations')
class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: Reservation })
  @Post()
  async reserveSpot(
    @Body() reserveSpotDto: ReserveSpotDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const reservation = await this.reservationService.createReservation(
      reserveSpotDto,
      request.user.id,
    );
    response.status(HttpStatus.OK).send(reservation);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: [Reservation] })
  @Get(':user_id')
  async getUserReservations(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const userReservations = await this.reservationService.findUserReservations(
      user_id,
      request.user.id,
    );
    response.status(HttpStatus.OK).send(userReservations);
  }

  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @ApiNoContentResponse()
  @Delete(':reservation_id')
  async cancelReservation(
    @Param('reservation_id', ParseIntPipe) reservation_id: number,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.reservationService.declineReservation(
      reservation_id,
      request.user.id,
    );
    response.status(HttpStatus.NO_CONTENT).send();
  }
}
export default ReservationController;

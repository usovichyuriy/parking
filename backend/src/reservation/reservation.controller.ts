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
} from '@nestjs/common';
import { Request, Response } from 'express';
import ReservationService from './reservation.service';
import { ReserveSpotDto } from './reserve-spot.dto';

@Controller('reservations')
class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async reserveSpot(
    @Body() reserveSpotDto: ReserveSpotDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const reservation = await this.reservationService.createReservation(
      reserveSpotDto,
      request.cookies.user_id,
    );
    response.status(HttpStatus.OK).send(reservation);
  }

  @Get(':user_id')
  async getUserReservations(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const userReservations = await this.reservationService.findUserReservations(
      user_id,
      request.cookies.user_id,
    );
    response.status(HttpStatus.OK).send(userReservations);
  }

  @Delete(':reservation_id')
  async cancelReservation(
    @Param('reservation_id', ParseIntPipe) reservation_id: number,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.reservationService.declineReservation(
      reservation_id,
      request.cookies.user_id,
    );
    response.status(HttpStatus.NO_CONTENT).send();
  }
}
export default ReservationController;

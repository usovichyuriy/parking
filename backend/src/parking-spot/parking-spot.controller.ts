import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import ParkingSpotService from './parking-spot.service';
import { Response } from 'express';

@Controller('parking-spots')
class ParkingSpotController {
  constructor(private readonly parkingSpotService: ParkingSpotService) {}

  @Get()
  async getParkingSpots(@Res() response: Response): Promise<void> {
    const parkingSpots = await this.parkingSpotService.getSpots();
    response.status(HttpStatus.OK).send(parkingSpots);
  }

  @Get(':id/available-times')
  async getAvailableTimeForSpot(
    @Param('id', ParseIntPipe) id: number,
    @Query('date') date: string,
    @Res() response: Response,
  ): Promise<void> {
    const availableTime = await this.parkingSpotService.getFreeTimeForSpot(
      id,
      date,
    );
    response.status(HttpStatus.OK).send(availableTime);
  }
}
export default ParkingSpotController;

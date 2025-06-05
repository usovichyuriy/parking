import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import ParkingSpotService from './parking-spot.service';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { ParkingSpot } from 'db/models/parking-spot.model';

@UseGuards(AuthGuard)
@Controller('parking-spots')
class ParkingSpotController {
  constructor(private readonly parkingSpotService: ParkingSpotService) {}

  @ApiOkResponse({ type: [ParkingSpot] })
  @Get()
  async getParkingSpots(@Res() response: Response): Promise<void> {
    const parkingSpots = await this.parkingSpotService.getSpots();
    response.status(HttpStatus.OK).send(parkingSpots);
  }

  @ApiOkResponse({
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  })
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

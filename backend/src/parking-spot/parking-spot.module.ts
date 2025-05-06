import { Module } from '@nestjs/common';
import ParkingSpotService from './parking-spot.service';
import { parkingSpotProviders } from './parking-spot.providers';
import ParkingSpotController from './parking-spot.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ParkingSpotController],
  providers: [ParkingSpotService, ...parkingSpotProviders],
})
export class ParkingSpotModule {}

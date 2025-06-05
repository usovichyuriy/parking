import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import {
  DATE_REGEX,
  TIME_REGEX,
} from './constants/reservation-validation.regex';
import { ApiProperty } from '@nestjs/swagger';

export class ReserveSpotDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  spotId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(DATE_REGEX)
  reservedDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(TIME_REGEX)
  reservedTime: string;
}

import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import {
  DATE_REGEX,
  TIME_REGEX,
} from './constants/reservation-validation.regex';

export class ReserveSpotDto {
  @IsNumber()
  @IsNotEmpty()
  spotId: number;

  @IsString()
  @IsNotEmpty()
  @Matches(DATE_REGEX)
  reservedDate: string;

  @IsString()
  @IsNotEmpty()
  @Matches(TIME_REGEX)
  reservedTime: string;
}

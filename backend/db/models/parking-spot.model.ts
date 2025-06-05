import { ApiProperty } from '@nestjs/swagger';
import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'parking_spots',
  freezeTableName: true,
})
export class ParkingSpot extends Model {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @ApiProperty()
  @Column
  location: string;
}

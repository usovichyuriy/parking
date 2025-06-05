import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { User } from './user.model';
import { ParkingSpot } from './parking-spot.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'reservations',
  freezeTableName: true,
})
export class Reservation extends Model {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @ApiProperty()
  @Column
  @ForeignKey(() => User)
  user_id: string;

  @ApiProperty()
  @Column
  @ForeignKey(() => ParkingSpot)
  parking_spot_number: string;

  @ApiProperty()
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  reserved_date: string;

  @ApiProperty()
  @Column
  reserved_time: string;

  @ApiProperty()
  @Column
  status: 'booked' | 'cancelled';
}

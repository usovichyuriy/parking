import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.model';
import { ParkingSpot } from './parking-spot.model';

@Table({
  tableName: 'reservations',
  freezeTableName: true,
})
export class Reservation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column
  @ForeignKey(() => User)
  user_id: string;

  @Column
  @ForeignKey(() => ParkingSpot)
  parking_spot_number: string;

  @Column
  reserved_date: Date;

  @Column
  reserved_time: string;

  @Column
  status: 'booked' | 'cancelled';
}

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

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  reserved_date: string;

  @Column
  reserved_time: string;

  @Column
  status: 'booked' | 'cancelled';
}

import { ApiProperty } from '@nestjs/swagger';
import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  freezeTableName: true,
})
export class User extends Model {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @ApiProperty()
  @Column
  email: string;

  @ApiProperty()
  @Column
  password: string;
}

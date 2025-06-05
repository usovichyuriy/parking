import { ApiProperty } from '@nestjs/swagger';
import { User } from 'db/models/user.model';

export class IAuthResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: User;
}

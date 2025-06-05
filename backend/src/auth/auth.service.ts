import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'db/models/user.model';
import { PROVIDERS_CONSTANTS } from 'src/database/providers.constants';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AUTH_RESPONSE_MESSAGES } from './auth-response.messages';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { IAuthResponse } from './IAuthResponse';

@Injectable()
class AuthService {
  constructor(
    @Inject(PROVIDERS_CONSTANTS.USERS_REPOSITORY)
    private usersRepository: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  private async createPasswordHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async comparePasswords(
    bodyPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(bodyPassword, userPassword);
  }

  private generateToken(id: number, email: string): string {
    return this.jwtService.sign({ id, email });
  }

  async registerUser(body: RegisterDto): Promise<IAuthResponse> {
    const isUserExists = !!(await this.usersRepository.findOne({
      where: { email: body.email },
    }));

    if (isUserExists) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        error: AUTH_RESPONSE_MESSAGES.USER_ALREADY_EXISTS,
      });
    }

    const password = await this.createPasswordHash(body.password);

    const user = await this.usersRepository.create({
      email: body.email,
      password,
    });
    const token = this.generateToken(user.id, user.email);

    return { token, user };
  }

  async loginUser(body: LoginDto): Promise<IAuthResponse> {
    const user = await this.usersRepository.findOne({
      where: { email: body.email },
    });

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: AUTH_RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }

    const isPasswordMatches = await this.comparePasswords(
      body.password,
      user.dataValues.password,
    );

    if (!isPasswordMatches) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: AUTH_RESPONSE_MESSAGES.WRONG_PASSWORD,
      });
    }

    const token = this.generateToken(user.id, user.email);
    return { token, user };
  }
}
export default AuthService;

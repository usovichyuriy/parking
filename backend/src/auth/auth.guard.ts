import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AUTH_RESPONSE_MESSAGES } from './auth-response.messages';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.access_token;

    if (!token) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: AUTH_RESPONSE_MESSAGES.UNAUTHORIZED,
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: AUTH_RESPONSE_MESSAGES.UNAUTHORIZED,
      });
    }
    return true;
  }
}

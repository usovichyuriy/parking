import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import AuthService from './auth.service';
import { getCookieConfig } from './cookie.config';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IAuthResponse } from './IAuthResponse';

@Controller('auth')
class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiConflictResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiCreatedResponse({ type: IAuthResponse })
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res() response: Response,
  ): Promise<void> {
    const registerResponse = await this.authService.registerUser(registerDto);
    const cookieConfig = getCookieConfig(this.configService);

    response
      .status(HttpStatus.CREATED)
      .cookie('access_token', registerResponse.token, cookieConfig)
      .send(registerResponse);
  }

  @ApiCreatedResponse({ type: IAuthResponse })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res() response: Response,
  ): Promise<void> {
    const loginResponse = await this.authService.loginUser(loginDto);
    const cookieConfig = getCookieConfig(this.configService);

    response
      .status(HttpStatus.OK)
      .cookie('access_token', loginResponse.token, cookieConfig)
      .send(loginResponse);
  }
}
export default AuthController;

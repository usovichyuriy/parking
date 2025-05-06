import { ConfigService } from '@nestjs/config';

export const getCookieConfig = (configService: ConfigService) => {
  return {
    httpOnly: configService.get<boolean>('COOKIE_HTTP_ONLY'),
    secure: configService.get<boolean>('COOKIE_SECURE'),
    maxAge: configService.get<number>('COOKIE_MAX_AGE'),
  };
};

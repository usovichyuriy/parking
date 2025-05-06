import { ParkingSpot } from 'db/models/parking-spot.model';
import { Reservation } from 'db/models/reservation.model';
import { User } from 'db/models/user.model';
import { Sequelize } from 'sequelize-typescript';
import { PROVIDERS_CONSTANTS } from './providers.constants';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: PROVIDERS_CONSTANTS.SEQUELIZE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        define: {
          timestamps: false,
        },
      });
      sequelize.addModels([User, ParkingSpot, Reservation]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

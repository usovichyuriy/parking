import { User } from 'db/models/user.model';
import { PROVIDERS_CONSTANTS } from 'src/database/providers.constants';

export const authProviders = [
  {
    provide: PROVIDERS_CONSTANTS.USERS_REPOSITORY,
    useValue: User,
  },
];

import { User } from 'db/models/user.model';
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user: User;
  }
}

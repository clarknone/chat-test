import { Types } from 'mongoose';

export interface IAuthUser {
  token: string;
  email: string;
  fullname?: string;
  id: Types.ObjectId;
}

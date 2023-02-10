import { Types } from 'mongoose';

export interface IAuthUser {
  token: string;
  email: string;
  fullname?: string;
  avatar?: string;
  id: Types.ObjectId;
}

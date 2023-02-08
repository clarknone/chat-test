import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail, isMobilePhone } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import * as crypto from 'crypto';
// export type UserDocument = User | Document;
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: [true, 'Full Name is required'] })
  fullname: string;

  @Prop({
    type: String,
    lowercase: true,
    required: [true, 'Email is required'],
    validate: [
      { validator: isEmail, message: (val) => 'please enter a valid email' },
    ],
  })
  email: string;


  @Prop({ type: String, required: [true, 'Password is required'] })
  password: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: Number, default: 0 })
  type: number;
}


export const UserSchema = SchemaFactory.createForClass(User);

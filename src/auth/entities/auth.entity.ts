import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: [true, 'Full Name is required'] })
  fullname: string;

  @Prop({
    type: String,
    required: [true, 'Email is required'],
    transform: (val: string) => (val ? val.toLowerCase() : ''),
    validate: [
      { validator: isEmail, message: () => 'please enter a valid email' },
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

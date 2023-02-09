import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail, isMobilePhone } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/auth/entities/auth.entity';

export type ChatDocument = HydratedDocument<Chat>;
export type ChatInviteDocument = HydratedDocument<ChatInvite>;
export type ChatTopicDocument = HydratedDocument<ChatTopic>;
export type ChatFileDocument = HydratedDocument<ChatFile>;

@Schema({ timestamps: true })
export class ChatTopic {
  @Prop({ type: Types.ObjectId, ref: 'User', require: true })
  user: User | Types.ObjectId;

  @Prop({ type: String, required: [true, 'message is required'] })
  title: string;

  @Prop({ type: Boolean, default: false })
  status: boolean;
}

@Schema({ timestamps: true })
export class ChatInvite {

  @Prop({ type: Types.ObjectId, ref: 'User', require: true })
  user: User;

  @Prop({
    type: String,
    required: [true, 'Email is required'],
    transform: (val: string) => (val ? val.toLowerCase() : ''),
    validate: [
      { validator: isEmail, message: () => 'please enter a valid email' },
    ],
  })
  email: string;

  @Prop({ type: String })
  fullname: string;

  @Prop({ type: Boolean, default: false })
  status: boolean;
}

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'ChatTopic' })
  topic: ChatTopic;

  @Prop({ type: Types.ObjectId, ref: 'ChatInvite' })
  invite: ChatInvite;

  // @Prop({
  //   type: String,
  //   required: [true, 'Email is required'],
  //   transform: (val: string) => (val ? val.toLowerCase() : ''),
  //   validate: [
  //     { validator: isEmail, message: () => 'please enter a valid email' },
  //   ],
  // })

  @Prop({ type: String })
  message: string;
  
  // @Prop({ type: Types.ObjectId, ref: 'ChatFile' })
  // file: ChatFile;
  
  @Prop({ type: String })
  file?: string;

  @Prop({ type: Boolean, default: false })
  isAnonymous: boolean;

  @Prop({ type: Number, default: 0 })
  type: number;
}

@Schema({ timestamps: true })
export class ChatFile {
  @Prop({ type: Types.ObjectId, ref: 'Chat', require: true })
  chat: Chat;

  @Prop({ type: String, required: [true, 'url is required'] })
  url: string;

  @Prop({ type: String, required: [true, 'message is required'] })
  type: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
export const ChatInviteSchema = SchemaFactory.createForClass(ChatInvite);
export const ChatTopicSchema = SchemaFactory.createForClass(ChatTopic);
export const ChatFileSchema = SchemaFactory.createForClass(ChatFile);

import { Module } from '@nestjs/common';
import { ChatSocketService } from './chat_socket.service';
import { ChatSocketGateway } from './chat_socket.gateway';
import { JwtSocketStrategy } from 'src/auth/strategy/jwt.socket.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Chat,
  ChatFile,
  ChatFileSchema,
  ChatInvite,
  ChatInviteSchema,
  ChatSchema,
  ChatTopic,
  ChatTopicSchema,
} from 'src/chat/entities/chat.entity';
import { User, UserSchema } from 'src/auth/entities/auth.entity';
import { ChatService } from 'src/chat/chat.service';
import { MailService } from 'src/mailer/mailer.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: ChatTopic.name, schema: ChatTopicSchema },
      { name: ChatInvite.name, schema: ChatInviteSchema },
      { name: ChatFile.name, schema: ChatFileSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CloudinaryModule,
  ],
  providers: [
    MailService,
    CloudinaryService,
    JwtSocketStrategy,
    ChatSocketGateway,
    ChatSocketService,
    ChatService,
  ],
})
export class ChatSocketModule {}

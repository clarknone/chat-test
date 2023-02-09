import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
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
} from './entities/chat.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MailModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    CloudinaryModule,
    MailModule,
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: ChatTopic.name, schema: ChatTopicSchema },
      { name: ChatInvite.name, schema: ChatInviteSchema },
      { name: ChatFile.name, schema: ChatFileSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [CloudinaryService,ChatService],
})
export class ChatModule {}

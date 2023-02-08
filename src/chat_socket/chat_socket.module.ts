import { Module } from '@nestjs/common';
import { ChatSocketService } from './chat_socket.service';
import { ChatSocketGateway } from './chat_socket.gateway';

@Module({
  providers: [ChatSocketGateway, ChatSocketService]
})
export class ChatSocketModule {}

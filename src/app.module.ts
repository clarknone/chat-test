import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatSocketModule } from './chat_socket/chat_socket.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, ChatSocketModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

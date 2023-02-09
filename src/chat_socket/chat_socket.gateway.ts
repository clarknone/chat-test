import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server } from 'socket.io';
import { ChatSocketService } from './chat_socket.service';
import { CreateChatSocketDto } from './dto/create-chat_socket.dto';
import { UpdateChatSocketDto } from './dto/update-chat_socket.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatSocketGateway {
  constructor(private readonly chatSocketService: ChatSocketService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string) {
    console.log({ data });
    // this.server.emit()
    const resp = { event: 'this is message', data: data };
    this.server.sockets.emit('events', "data");
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return 434343;
  }
}

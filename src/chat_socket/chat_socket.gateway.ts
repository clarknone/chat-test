import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ChatSocketService } from './chat_socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private cloudinaryService: CloudinaryService,
    private readonly chatSocketService: ChatSocketService,
  ) {}

  handleDisconnect(client: Socket) {
    // client.disconnect()
    // throw new Error('Method not implemented.');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const topic = client.handshake.query['topic'];
    this.chatSocketService
      .joinTopic(topic as string)
      .then((hasJoined) => {
        if (hasJoined) {
          client.join(topic);
        } else {
          this.server.to(client.id).emit('error', 'invalid topic');
          client.disconnect();
        }
      })
      .catch((e) => {
        // console.log({});
      });
  }

  @SubscribeMessage('message')
  async handleEvent(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.chatSocketService
      .getUserFromID(data.user)
      .then(async (user) => {
        return this.chatSocketService.sendMessage(user, data).then((chat) => {
          return this.server.sockets
            .to(chat.topic.toString())
            .emit('message', chat);
        });
      })
      .catch((e) => {
        this.server.to(client.id).emit('error', 'failed to send message');
      });
  }
}

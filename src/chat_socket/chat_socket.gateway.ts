import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChatSocketService } from './chat_socket.service';
import { CreateChatSocketDto } from './dto/create-chat_socket.dto';
import { UpdateChatSocketDto } from './dto/update-chat_socket.dto';

@WebSocketGateway()
export class ChatSocketGateway {
  constructor(private readonly chatSocketService: ChatSocketService) {}

  @SubscribeMessage('createChatSocket')
  create(@MessageBody() createChatSocketDto: CreateChatSocketDto) {
    return this.chatSocketService.create(createChatSocketDto);
  }

  @SubscribeMessage('findAllChatSocket')
  findAll() {
    return this.chatSocketService.findAll();
  }

  @SubscribeMessage('findOneChatSocket')
  findOne(@MessageBody() id: number) {
    return this.chatSocketService.findOne(id);
  }

  @SubscribeMessage('updateChatSocket')
  update(@MessageBody() updateChatSocketDto: UpdateChatSocketDto) {
    return this.chatSocketService.update(updateChatSocketDto.id, updateChatSocketDto);
  }

  @SubscribeMessage('removeChatSocket')
  remove(@MessageBody() id: number) {
    return this.chatSocketService.remove(id);
  }
}

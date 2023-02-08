import { PartialType } from '@nestjs/mapped-types';
import { CreateChatSocketDto } from './create-chat_socket.dto';

export class UpdateChatSocketDto extends PartialType(CreateChatSocketDto) {
  id: number;
}

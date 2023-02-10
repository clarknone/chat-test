import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/entities/auth.entity';
import { ChatService } from 'src/chat/chat.service';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { ChatTopic, ChatTopicDocument } from 'src/chat/entities/chat.entity';
import { IAuthUser } from 'src/helper/interfaces/auth/auth.interface';
import { CreateChatSocketDto } from './dto/create-chat_socket.dto';
import { UpdateChatSocketDto } from './dto/update-chat_socket.dto';

@Injectable()
export class ChatSocketService {
  constructor(
    @InjectModel(User.name) private UserSchema: Model<UserDocument>,
    @InjectModel(ChatTopic.name)
    private ChatTopicSchema: Model<ChatTopicDocument>,
    private chatService: ChatService,
  ) {}

  async joinTopic(topic: string): Promise<Boolean> {
    return this.ChatTopicSchema.findById(topic).then((item) => {
      return !!item;
    });
  }

  async getUserFromID(id: string): Promise<IAuthUser | undefined> {
    return this.UserSchema.findById(id).then((user) => {
      if (user) {
        const authUser: IAuthUser = {
          token: '',
          email: user.email,
          id: user._id,
          fullname: user.fullname,
        };
        return authUser;
      }
      return;
    });
  }

  async sendMessage(user: IAuthUser, data: CreateChatDto) {
    return this.chatService.sendMessage(data, user).then((chat) => {
      return chat
    });
  }

  create(createChatSocketDto: CreateChatSocketDto) {
    return 'This action adds a new chatSocket';
  }

  findAll() {
    return `This action returns all chatSocket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatSocket`;
  }

  update(id: number, updateChatSocketDto: UpdateChatSocketDto) {
    return `This action updates a #${id} chatSocket`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatSocket`;
  }
}

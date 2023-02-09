import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceException } from 'src/helper/exceptions/service.exception';
import { IAuthUser } from 'src/helper/interfaces/auth/auth.interface';
import { MailService } from 'src/mailer/mailer.service';
import {
  CreateChatDto,
  CreateChatInviteDto,
  CreateChatTopicDto,
} from './dto/create-chat.dto';
import { ChatFilterDto } from './dto/filter.dto';
import { EditChatTopicDto } from './dto/update-chat.dto';
import {
  Chat,
  ChatDocument,
  ChatFile,
  ChatFileDocument,
  ChatInvite,
  ChatInviteDocument,
  ChatTopic,
  ChatTopicDocument,
} from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatTopic.name)
    private ChatTopicModel: Model<ChatTopicDocument>,

    @InjectModel(ChatInvite.name)
    private ChatInviteModel: Model<ChatInviteDocument>,

    @InjectModel(Chat.name)
    private ChatModel: Model<ChatDocument>,

    @InjectModel(ChatFile.name)
    private ChatFileModel: Model<ChatFileDocument>,

    private mailService: MailService,
  ) {}

  sendMessage(createChatDto: CreateChatDto, user?: IAuthUser) {
    return this.ChatModel.create({
      ...createChatDto,
      user: user.id || null,
    }).then((chat) => {
      //uploadFile
    });
  }

  getAllMessages(filter: ChatFilterDto) {
    return this.ChatModel.find({ ...filter }).populate([
      { path: 'user', select: ['fullname', 'email'] },
      { path: 'invite', select: ['fullname', 'email'] },
      // { path: 'ChatFile', select: ['url', 'type'], strictPopulate: false },
    ]);
  }

  async inviteUser(user: IAuthUser, data: CreateChatInviteDto) {
    return this.ChatInviteModel.create({ ...data, user: user.id }).then(
      (invite) => {
        return this.mailService.sendUserConfirmation(user,invite)
        //send Email
      },
    );
  }

  getTopics(user: IAuthUser) {
    return this.ChatTopicModel.find({ user: user.id });
  }

  async editTopic(user: IAuthUser, data: EditChatTopicDto) {
    return this.ChatTopicModel.findById(data.id).then((topic) => {
      if (!topic) {
        throw new ServiceException({ error: 'Invailid topic id' });
      } else if (topic.user != user.id) {
        throw new ServiceException({
          error: 'permission denied ',
          status: 403,
        });
      } else {
        topic.title = data.title;
        return topic.save();
      }
    });
  }

  createTopic(user: IAuthUser, data: CreateChatTopicDto) {
    return this.ChatTopicModel.create({ ...data, user: user.id });
  }

  async deleteTopic(user: IAuthUser, id: string) {
    return this.ChatTopicModel.findById(id).then((topic) => {
      if (!topic) {
        throw new ServiceException({ error: 'Invailid topic id' });
      } else if (topic.user.toString() != user.id.toString()) {
        throw new ServiceException({
          error: 'permission denied ',
          status: 403,
        });
      } else {
        return topic.delete();
      }
    });
  }
}

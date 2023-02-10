import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UploadApiResponse } from 'cloudinary';
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

  async sendMessage(
    createChatDto: CreateChatDto,
    user?: IAuthUser,
  ): Promise<ChatDocument> {
    return this.ChatModel.create({
      ...createChatDto,
      user: user?.id || null,
    }).then((chat) => {
      //uploadFile
      return chat.populate([
        { path: 'user', select: ['fullname', 'email'] },
        { path: 'invite', select: ['fullname', 'email'] },
        { path: 'file', select: ['url', 'type', 'format'] },
      ]);
    });
  }

  getAllMessages(filter: ChatFilterDto) {
    return this.ChatModel.find({ ...filter }).populate([
      { path: 'user', select: ['fullname', 'email'] },
      { path: 'invite', select: ['fullname', 'email'] },
      { path: 'file', select: ['url', 'type', 'format'] },
    ]);
  }

  async inviteUser(user: IAuthUser, data: CreateChatInviteDto) {
    return this.ChatInviteModel.create({ ...data, user: user.id }).then(
      (invite) => {
        return this.mailService.sendUserConfirmation(user, invite);
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

  uploadFile(cloudinaryResponse: UploadApiResponse) {
    return this.ChatFileModel.create({
      url: cloudinaryResponse.secure_url,
      pid: cloudinaryResponse.public_id,
      type: cloudinaryResponse.resource_type,
      format: cloudinaryResponse.format,
    });
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
        return this.ChatModel.deleteMany({ topic: topic._id }).then(() => {
          return topic.delete();
        });
      }
    });
  }
}

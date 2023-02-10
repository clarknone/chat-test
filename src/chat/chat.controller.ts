import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GetAuthUser } from 'src/helper/decorators/auth.decorator';
import { ServiceException } from 'src/helper/exceptions/service.exception';
import { JwtAuthGuard, JwtAuthPublicGuard } from 'src/helper/guard/user.guard';
import { IAuthUser } from 'src/helper/interfaces/auth/auth.interface';
import { ChatService } from './chat.service';
import {
  CreateChatDto,
  CreateChatInviteDto,
  CreateChatTopicDto,
} from './dto/create-chat.dto';
import { ChatFilterDto } from './dto/filter.dto';
import { EditChatTopicDto } from './dto/update-chat.dto';
import { ChatFile, ChatFileDocument } from './entities/chat.entity';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('invite')
  inviteUser(
    @Body() data: CreateChatInviteDto,
    @GetAuthUser() user: IAuthUser,
  ) {
    return this.chatService.inviteUser(user, data);
  }

  @UseGuards(JwtAuthPublicGuard)
  @Post()
  create(@Body() createChatDto: CreateChatDto, @GetAuthUser() user: IAuthUser) {
    return this.chatService.sendMessage(createChatDto, user);
  }

  @Get()
  getMessages(@Query() query: ChatFilterDto) {
    if (!query.topic) {
      return [];
    }
    return this.chatService.getAllMessages(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('topic')
  getTopic(@GetAuthUser() user: IAuthUser) {
    return this.chatService.getTopics(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('topic')
  createTopic(
    @GetAuthUser() user: IAuthUser,
    @Body() data: CreateChatTopicDto,
  ) {
    return this.chatService.createTopic(user, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('topic')
  updateTopic(@GetAuthUser() user: IAuthUser, @Body() data: EditChatTopicDto) {
    return this.chatService.editTopic(user, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('topic/:id')
  removeTopic(@GetAuthUser() user: IAuthUser, @Param('id') id: string) {
    return this.chatService.deleteTopic(user, id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @Post('file/upload')
  async editProfile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ChatFileDocument> {
    if (file) {
      try {
        const response = await this.cloudinaryService.uploadImage(file);
        return this.chatService.uploadFile(response as UploadApiResponse);
      } catch (e) {
        throw new ServiceException({ error: 'failed to upload file' });
      }
    }
    throw new ServiceException({ error: 'failed to upload file' });
  }
}

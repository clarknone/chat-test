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
} from '@nestjs/common';
import { GetAuthUser } from 'src/helper/decorators/auth.decorator';
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

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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
}

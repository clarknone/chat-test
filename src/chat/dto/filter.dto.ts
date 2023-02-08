import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatFilterDto {
  @IsString()
  @IsOptional()
  topic: string;
}

export class CreateChatTopicDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class CreateChatInviteDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

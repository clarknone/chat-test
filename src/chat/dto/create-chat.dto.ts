import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsOptional()
  invite?: string;
  
  @IsString()
  @IsOptional()
  user?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsNotEmpty()
  topic: string;

  // @IsString()
  @IsOptional()
  file?: string;
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
  
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;
}

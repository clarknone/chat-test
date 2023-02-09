import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatFilterDto {
  @IsString()
  @IsOptional()
  topic: string;
}

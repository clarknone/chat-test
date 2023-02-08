import { IsNotEmpty, IsString } from 'class-validator';


export class EditChatTopicDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}

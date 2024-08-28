import { IsNumber, IsString } from 'class-validator';

export class CreateUserNotificationDto {
  @IsNumber()
  user_id: number;

  @IsString()
  token: string;
}

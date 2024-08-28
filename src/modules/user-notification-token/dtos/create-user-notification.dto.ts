import { IsNumber, IsString } from 'class-validator';

export class RegisterUserNotificationDto {
  @IsNumber()
  user_id: number;

  @IsString()
  token: string;
}

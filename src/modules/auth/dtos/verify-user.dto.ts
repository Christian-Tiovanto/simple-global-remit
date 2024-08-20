import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty({ example: 123456 })
  otp: string;
}

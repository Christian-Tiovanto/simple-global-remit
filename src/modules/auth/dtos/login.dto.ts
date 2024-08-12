import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { escapeHtml } from 'src/utils/escape-html';

export class LoginDto {
  @ApiProperty({ example: 'christiantiovanto1@gmail.com' })
  @Transform(escapeHtml)
  email: string;

  @ApiProperty({ example: '123456' })
  @Transform(escapeHtml)
  password: string;
}

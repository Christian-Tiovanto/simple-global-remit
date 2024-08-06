import { Transform } from 'class-transformer';
import { escapeHtml } from 'src/utils/escape-html';

export class LoginDto {
  @Transform(escapeHtml)
  email: string;

  @Transform(escapeHtml)
  password: string;
}

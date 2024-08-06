import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../services/auth.services';
import { ResponseFormatInterceptor } from 'src/interceptors/response-format.interceptor';
import { LoginDto } from '../dtos/login.dto';

@Controller('user')
@UseInterceptors(ResponseFormatInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.services';
import { LoginDto } from '../dtos/login.dto';

@Controller('api/v1/user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ResponseFormatInterceptor } from 'src/interceptors/response-format.interceptor';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { DataValidationPipe } from 'src/pipes/validation.pipe';

@Controller('api/v1/user')
@UseInterceptors(ResponseFormatInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUser() {
    return await this.userService.getAllUser();
  }

  @Post()
  @UsePipes(new DataValidationPipe())
  async createUser(@Body() userDto: CreateUserDto) {
    return await this.userService.createUser(userDto);
  }
}

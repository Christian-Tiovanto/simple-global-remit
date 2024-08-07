import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ResponseFormatInterceptor } from 'src/interceptors/response-format.interceptor';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { DataValidationPipe } from 'src/pipes/validation.pipe';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUser() {
    return await this.userService.getAllUser();
  }

  @Post()
  async createUser(@Body() userDto: CreateUserDto) {
    return await this.userService.createUser(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserbyId(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserbyId(id);
  }
}

import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
import { User } from '../models/user.entity';
import { CreateUserResponse, GetUserResponse } from '../classes/user.class';
@ApiTags('user')
@ApiBearerAuth()
@ApiExtraModels(CreateUserResponse, GetUserResponse)
@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: 'use this API to get All available user',
    schema: SwaggerResponseWrapper.createResponseList(User),
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUser() {
    return await this.userService.getAllUser();
  }

  @ApiCreatedResponse({
    description: 'use this API to create new user',
    schema: SwaggerResponseWrapper.createResponse(CreateUserResponse),
  })
  @Post()
  async createUser(@Body() userDto: CreateUserDto) {
    return await this.userService.createUser(userDto);
  }

  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({
    description: 'Use this API to get user by id',
    schema: SwaggerResponseWrapper.createResponse(GetUserResponse),
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserbyId(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserbyId(id);
  }
}

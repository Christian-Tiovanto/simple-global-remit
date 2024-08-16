import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
import { User } from '../models/user.entity';
import { CreateUserResponse, GetAllUserQuery, GetUserResponse } from '../classes/user.class';
import { Auth } from 'src/decorators/auth.decorator';
import { Role } from 'src/enums/user-role';
@ApiTags('user')
@ApiBearerAuth()
@ApiExtraModels(CreateUserResponse, GetUserResponse)
@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'use this API to get All available user. Roles[admin]' })
  @ApiOkResponse({
    description: 'use this API to get All available user',
    schema: SwaggerResponseWrapper.createResponseList(User),
  })
  @ApiQuery({
    description: 'use the query string for defining the user role',
    name: 'role',
    required: false,
  })
  // @Auth(Role.ADMIN)
  @Get()
  async getAllUser(@Query() query: GetAllUserQuery) {
    return await this.userService.getAllUser(query.role);
  }

  @ApiOperation({ summary: 'use this API to create new user. Roles[admin]' })
  @ApiTags('auth')
  @ApiCreatedResponse({
    description: 'use this API to create new user',
    schema: SwaggerResponseWrapper.createResponse(CreateUserResponse),
  })
  @Auth(Role.ADMIN)
  @Post()
  async createUser(@Body() userDto: CreateUserDto) {
    return await this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Use this API to get user by id. Roles[admin,client]' })
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

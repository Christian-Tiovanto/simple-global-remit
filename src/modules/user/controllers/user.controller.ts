import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
import { User as UserEntity } from '../models/user.entity';
import { CreateUserResponse, GetAllUserQuery, GetUserResponse } from '../classes/user.class';
import { User } from 'src/decorators/user.decorator';
@ApiTags('user')
@ApiBearerAuth()
@ApiExtraModels(CreateUserResponse, GetUserResponse)
@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'use this API to get All available user. Roles[admin]' })
  @ApiOkResponse({
    description: 'use this API to get All available user',
    schema: SwaggerResponseWrapper.createResponseList(UserEntity),
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

  @ApiOperation({ summary: 'use this API to get logged in user profile. Roles[admin,client]' })
  @ApiOkResponse({ schema: SwaggerResponseWrapper.createResponse(GetUserResponse) })
  @UseGuards(JwtAuthGuard)
  @Get('/me/profile')
  async getLoggedInUserProfile(@User() user) {
    return await this.userService.getLoggedInUserProfile(user.id);
  }
}

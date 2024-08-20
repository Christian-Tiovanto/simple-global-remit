import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.services';
import { LoginDto } from '../dtos/login.dto';
import { ApiCreatedResponse, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtTokenResponse } from '../classes/auth.class';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import { CreateUserResponse } from 'src/modules/user/classes/user.class';

@ApiTags('auth')
@Controller('api/v1/user')
@ApiExtraModels(JwtTokenResponse)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Use this Api for Login. Roles[admin,client]' })
  @ApiCreatedResponse({
    description: 'Login succesfull',
    schema: SwaggerResponseWrapper.createResponse(JwtTokenResponse),
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'use this API to create new user. Roles[admin,client]' })
  @ApiCreatedResponse({
    description: 'use this API to create new user',
    schema: SwaggerResponseWrapper.createResponse(CreateUserResponse),
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}

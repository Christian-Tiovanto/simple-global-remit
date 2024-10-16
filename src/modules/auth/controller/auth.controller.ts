import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.services';
import { LoginDto } from '../dtos/login.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtTokenResponse } from '../classes/auth.class';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import { CreateUserResponse } from 'src/modules/user/classes/user.class';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { VerifyUserDto } from '../dtos/verify-user.dto';

@ApiTags('auth')
@Controller('api/v1/auth')
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-otp')
  async getOtp(@User() user) {
    return this.authService.getOtp(user.email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('verify-user')
  async verifyUser(@User() user, @Body() verifyUserDto: VerifyUserDto) {
    return await this.authService.verifyUser(user.email, verifyUserDto);
  }
}

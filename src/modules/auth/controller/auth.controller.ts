import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.services';
import { LoginDto } from '../dtos/login.dto';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponseSchemaHost,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { GetAccountResponse } from 'src/modules/account/classes/account.class';
import { JwtTokenResponse } from '../classes/auth.class';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';

@ApiTags('user')
@Controller('api/v1/user')
@ApiExtraModels(JwtTokenResponse)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Use this Api for Login' })
  @ApiCreatedResponse({
    description: 'Login succesfull',
    schema: SwaggerResponseWrapper.createResponse(JwtTokenResponse),
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

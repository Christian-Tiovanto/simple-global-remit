import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccountCreateResponse, GetAccountResponse } from '../classes/account.class';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
import { Auth } from 'src/decorators/auth.decorator';
import { Role } from 'src/enums/user-role';

@Controller('api/v1/account')
@ApiTags('Account')
@ApiBearerAuth()
@ApiExtraModels(AccountCreateResponse, GetAccountResponse)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @ApiOperation({ summary: 'use this API to Create a new Account. Roles[admin]' })
  @ApiCreatedResponse({
    description: 'The Account has been successfully created',
    schema: SwaggerResponseWrapper.createResponse(AccountCreateResponse),
  })
  @Auth(Role.ADMIN)
  @Post()
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return await this.accountService.createAccount(createAccountDto);
  }

  @ApiOperation({ summary: 'use this API to get user account. Roles[admin,client]' })
  @ApiOkResponse({ schema: SwaggerResponseWrapper.createResponse(GetAccountResponse) })
  // @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUserAccount(@Request() req) {
    return await this.accountService.getUserAccount(req.user.id);
  }
}

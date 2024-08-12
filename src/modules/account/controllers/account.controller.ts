import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccountCreateResponse, GetAccountResponse } from '../classes/account.class';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';

@Controller('api/v1/account')
@ApiTags('Account')
@ApiBearerAuth()
@ApiExtraModels(AccountCreateResponse, GetAccountResponse)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @ApiCreatedResponse({
    description: 'The Account has been successfully created',
    schema: SwaggerResponseWrapper.createResponse(AccountCreateResponse),
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return await this.accountService.createAccount(createAccountDto);
  }

  @ApiOkResponse({ schema: SwaggerResponseWrapper.createResponse(GetAccountResponse) })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUserAccount(@Request() req) {
    return await this.accountService.getUserAccount(req.user.id);
  }
}

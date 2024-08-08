import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
@Controller('api/v1/account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return await this.accountService.createAccount(createAccountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUserAccount(@Request() req) {
    return await this.accountService.getUserAccount(req.user.id);
  }
}

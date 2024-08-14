import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from '../models/transactions.entity';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';

@ApiTags('transaction')
@ApiBearerAuth()
@Controller('api/v1/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @ApiCreatedResponse({ description: 'use this API to create a new transcation', type: Transaction })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTransaction(@Request() req, @Body() createTransactionQuery: CreateTransactionDto) {
    return await this.transactionService.createTransaction(createTransactionQuery, parseInt(req.user.id));
  }

  @ApiOkResponse({
    description: 'use this API to get user transaction History',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserTransactionHistory(@Request() req) {
    return await this.transactionService.getUserTransactionHistory(req.user.id);
  }
}

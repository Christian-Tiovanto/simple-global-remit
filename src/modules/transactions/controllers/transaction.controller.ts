import { Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionQuery } from '../classess/create-transaction.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('api/v1/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTransaction(@Request() req, @Query() createTransactionQuery: CreateTransactionQuery) {
    return await this.transactionService.createTransaction(createTransactionQuery, parseInt(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserTransactionHistory(@Request() req) {
    return await this.transactionService.getUserTransactionHistory(req.user.id);
  }
}

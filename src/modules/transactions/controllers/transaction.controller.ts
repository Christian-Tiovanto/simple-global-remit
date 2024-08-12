import { Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionQuery, GetTransactionHistoryResponse } from '../classess/transaction.class';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from '../models/transactions.entity';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';

@ApiTags('transaction')
@ApiBearerAuth()
@ApiExtraModels(GetTransactionHistoryResponse)
@Controller('api/v1/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @ApiCreatedResponse({ description: 'use this API to create a new transcation', type: Transaction })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTransaction(@Request() req, @Query() createTransactionQuery: CreateTransactionQuery) {
    return await this.transactionService.createTransaction(createTransactionQuery, parseInt(req.user.id));
  }

  @ApiOkResponse({
    description: 'use this API to get user transaction History',
    schema: SwaggerResponseWrapper.createResponseList(GetTransactionHistoryResponse),
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserTransactionHistory(@Request() req) {
    return await this.transactionService.getUserTransactionHistory(req.user.id);
  }
}

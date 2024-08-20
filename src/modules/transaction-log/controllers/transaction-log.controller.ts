import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TransactionLogService } from '../services/transaction-log.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/logs')
export class TransactionLogController {
  constructor(private transactionLogService: TransactionLogService) {}

  @ApiTags('logs')
  @Get(':id')
  async getTransactionLogsByTransactionId(@Param('id', ParseIntPipe) id: number) {
    return await this.transactionLogService.getTransactionLogsByTransactionId(id);
  }
}

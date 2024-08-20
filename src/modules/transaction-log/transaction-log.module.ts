import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionLog } from './models/transaction-log.entity';
import { TransactionLogService } from './services/transaction-log.service';
import { TransactionLogController } from './controllers/transaction-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionLog])],
  providers: [TransactionLogService],
  exports: [TransactionLogService],
  controllers: [TransactionLogController],
})
export class TransactionLogModule {}

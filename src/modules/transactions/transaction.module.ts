import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './models/transactions.entity';
import { TransactionService } from './services/transaction.service';
import { TransactionController } from './controllers/transaction.controller';
import { AccountModule } from '../account/account.module';
import { CurrencyModule } from '../currency/currency.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Transaction]), AccountModule, CurrencyModule],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}

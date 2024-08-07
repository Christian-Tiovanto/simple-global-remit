import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './models/transactions.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Transaction])],
})
export class TransactionModule {}

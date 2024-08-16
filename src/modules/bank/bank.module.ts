import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './model/bank.entity';
import { BankController } from './controllers/bank.controller';
import { BankService } from './services/bank.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  controllers: [BankController],
  providers: [BankService],
})
export class BankModule {}

import { Module } from '@nestjs/common';
import { ExchangeRateService } from './services/exhange-rate.service';
import { ExchangeRateController } from './controllers/exchange-rate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from './models/exchange-rate.entity';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate]), AccountModule],
  providers: [ExchangeRateService],
  controllers: [ExchangeRateController],
})
export class ExchangeRateModule {}

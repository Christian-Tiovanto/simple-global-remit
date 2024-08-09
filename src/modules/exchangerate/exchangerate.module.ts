import { Module } from '@nestjs/common';
import { ExchangeRateService } from './services/exhange-rate.service';
import { ExchangeRateController } from './controllers/exchange-rate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from './models/exchange-rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate])],
  providers: [ExchangeRateService],
  controllers: [ExchangeRateController],
})
export class ExchangeRateModule {}

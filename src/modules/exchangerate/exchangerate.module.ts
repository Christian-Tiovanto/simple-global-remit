import { Module } from '@nestjs/common';
import { ExchangeRateService } from './services/exhange-rate.service';
import { ExchangeRateController } from './controllers/exchange-rate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from './models/exchange-rate.entity';
import { DestinationFeeModule } from '../destination-fee/destination-fee.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate]), DestinationFeeModule],
  providers: [ExchangeRateService],
  controllers: [ExchangeRateController],
  exports: [ExchangeRateService],
})
export class ExchangeRateModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinationFee } from './model/destination-fee.entity';
import { DestinationFeeService } from './services/destination-fee.service';
import { DestinationFeeController } from './controllers/destination-fee.controller';
import { CountryModule } from '../country/country.module';

@Module({
  imports: [TypeOrmModule.forFeature([DestinationFee]), CountryModule],
  exports: [DestinationFeeService],
  controllers: [DestinationFeeController],
  providers: [DestinationFeeService],
})
export class DestinationFeeModule {}

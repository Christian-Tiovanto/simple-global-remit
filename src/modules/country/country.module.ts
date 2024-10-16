import { Module } from '@nestjs/common';
import { CountryController } from './controllers/country.controller';
import { CountryService } from './services/country.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './model/country.entity';
import { CurrencyModule } from '../currency/currency.module';
import { CountryCurrency } from './model/country-currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country, CountryCurrency]), CurrencyModule],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}

import { ApiProperty } from '@nestjs/swagger';
import { Country } from '../model/country.entity';
import { CountryCurrency } from '../model/country-currency.entity';

export class GetAllCountryAndCurrencyResponse extends Country {
  @ApiProperty({ type: [String], example: ['USD', 'EUR'] })
  country_currency: CountryCurrency[];
}

import { ApiProperty } from '@nestjs/swagger';
import { Country } from '../model/country.entity';
import { CountryCurrency } from '../model/country-currency.entity';

export class GetAllCountryAndCurrencyResponse extends Country {
  @ApiProperty({ example: 40000 })
  fee: number;

  @ApiProperty({ type: [], example: [{ currency_name: 'US_Dollar', exchange_rate: 300, currency_signature: 'USD' }] })
  country_currency: CountryCurrency[];
}
export class GetAllCountryAndCurrencyRateResponse extends Country {
  @ApiProperty({ example: 0.00045 })
  exchange_rate: number;
}

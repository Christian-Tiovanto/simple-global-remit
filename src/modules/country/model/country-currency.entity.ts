import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Country } from './country.entity';
import { Currency } from 'src/modules/currency/models/currency.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('country_currency')
@Unique(['country_signature', 'country_currency'])
export class CountryCurrency {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Country })
  @ManyToOne(() => Country, (country) => country.country_currency)
  @JoinColumn({ name: 'country_signature', referencedColumnName: 'country_signature' })
  country_signature: Country;

  @ApiProperty({ type: () => Currency })
  @JoinColumn({ name: 'country_currency' })
  @ManyToOne(() => Currency, (country) => country.currency_signature)
  country_currency: Currency;
}

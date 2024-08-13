import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Country } from './country.entity';
import { Currency } from 'src/modules/currency/models/currency.entity';

@Entity('country_currency')
@Unique(['country_signature', 'country_currency'])
export class CountryCurrency {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Country, (country) => country.country_currency)
  @JoinColumn({ name: 'country_signature', referencedColumnName: 'country_signature' })
  country_signature: Country;

  @JoinColumn({ name: 'country_currency' })
  @ManyToOne(() => Currency, (country) => country.currency_signature)
  country_currency: Currency;
}

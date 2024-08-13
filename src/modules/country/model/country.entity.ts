import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CountryCurrency } from './country-currency.entity';

@Entity()
export class Country {
  @PrimaryColumn({ length: 3 })
  country_signature: string;

  @Column()
  country_name: string;

  @OneToMany(() => CountryCurrency, (country_currency) => country_currency.country_signature)
  country_currency: CountryCurrency[];
}

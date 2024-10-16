import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CountryCurrency } from './country-currency.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from 'src/modules/currency/models/currency.entity';

@Entity()
export class Country {
  @ApiProperty({ example: 'IDN' })
  @PrimaryColumn({ length: 3 })
  country_signature: string;

  @ApiProperty({ example: 'Indonesia' })
  @Column()
  country_name: string;

  @OneToMany(() => CountryCurrency, (country_currency) => country_currency.country_signature)
  country_currency: CountryCurrency[];
}

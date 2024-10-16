import { ApiProperty } from '@nestjs/swagger';
import { CreateCountryDto } from 'src/modules/country/dtos/create-country.dto';
import { Country } from 'src/modules/country/model/country.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['from_country', 'to_country'])
export class DestinationFee {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: CreateCountryDto })
  @ManyToOne(() => Country, (country) => country.country_signature)
  @JoinColumn({ name: 'from_country' })
  from_country: Country;

  @ApiProperty({ example: CreateCountryDto })
  @ManyToOne(() => Country, (country) => country.country_signature)
  @JoinColumn({ name: 'to_country' })
  to_country: Country;

  @ApiProperty({ example: 40000 })
  @Column({ type: 'decimal' })
  fee: number;
}

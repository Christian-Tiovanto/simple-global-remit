import { Country } from 'src/modules/country/model/country.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['from_country', 'to_country'])
export class DestinationFee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Country, (country) => country.country_signature)
  @JoinColumn({ name: 'from_country' })
  from_country: Country;

  @ManyToOne(() => Country, (country) => country.country_signature)
  @JoinColumn({ name: 'to_country' })
  to_country: Country;

  @Column({ type: 'decimal' })
  fee: number;
}

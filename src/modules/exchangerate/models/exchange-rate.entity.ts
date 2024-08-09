import { Currency } from 'src/modules/currency/models/currency.entity';
import { CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class ExchangeRate {
  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'fromCurrency' })
  fromCurrency: Currency;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'toCurrency' })
  toCurrency: Currency;

  exhangerate: number;

  @CreateDateColumn()
  createdAt: Date;
}

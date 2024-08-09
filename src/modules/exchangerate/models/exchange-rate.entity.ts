import { Currency } from 'src/modules/currency/models/currency.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ExchangeRate {
  @PrimaryColumn({ type: 'varchar' })
  fromCurrencyCode: string;

  @PrimaryColumn({ type: 'varchar' })
  toCurrencyCode: string;

  @ManyToOne(() => Currency, { nullable: false })
  @JoinColumn({ name: 'fromCurrencyCode' })
  fromCurrency: Currency;

  @ManyToOne(() => Currency, { nullable: false })
  @JoinColumn({ name: 'toCurrencyCode' })
  toCurrency: Currency;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  exchangeRate: number;
}

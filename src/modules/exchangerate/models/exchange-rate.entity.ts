import { ApiProperty } from '@nestjs/swagger';
import { Currency } from 'src/modules/currency/models/currency.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ExchangeRate {
  @ApiProperty({ example: 'USD' })
  @PrimaryColumn({ type: 'varchar' })
  fromCurrencyCode: string;

  @ApiProperty({ example: 'EUR' })
  @PrimaryColumn({ type: 'varchar' })
  toCurrencyCode: string;

  @ManyToOne(() => Currency, { nullable: false })
  @JoinColumn({ name: 'fromCurrencyCode' })
  fromCurrency: Currency;

  @ManyToOne(() => Currency, { nullable: false })
  @JoinColumn({ name: 'toCurrencyCode' })
  toCurrency: Currency;

  @ApiProperty({ type: Date, format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: Date, format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: 200 })
  @Column()
  exchangeRate: number;
}

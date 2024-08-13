import { ApiProperty } from '@nestjs/swagger';
import { ExchangeRateColumnName } from 'src/enums/country-column';
import { Currency } from 'src/modules/currency/models/currency.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ExchangeRate {
  @ApiProperty({ example: 'USD' })
  @PrimaryColumn({ type: 'varchar', name: ExchangeRateColumnName.FROM_CURRENCY })
  fromCurrencyCode: string;

  @ApiProperty({ example: 'EUR' })
  @PrimaryColumn({ type: 'varchar', name: ExchangeRateColumnName.TO_CURRENCY })
  toCurrencyCode: string;

  @ManyToOne(() => Currency, { nullable: false })
  @JoinColumn({ name: ExchangeRateColumnName.FROM_CURRENCY })
  fromCurrency: Currency;

  @ManyToOne(() => Currency, { nullable: false })
  @JoinColumn({ name: ExchangeRateColumnName.TO_CURRENCY })
  toCurrency: Currency;

  @ApiProperty({ type: Date, format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: Date, format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: 200 })
  @Column({ type: 'double precision' })
  exchangeRate: number;

  @ApiProperty({ example: 70000 })
  @Column({ type: 'decimal' })
  fee: number;
}

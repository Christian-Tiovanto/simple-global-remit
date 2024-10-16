import { ApiProperty } from '@nestjs/swagger';
import { ExchangeRateColumnName } from 'src/enums/country-column';
import { Currency } from 'src/modules/currency/models/currency.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ExchangeRate {
  @ApiProperty({ example: 'USD' })
  @PrimaryColumn({ type: 'varchar' })
  from_currency_code: string;

  @ApiProperty({ example: 'EUR' })
  @PrimaryColumn({ type: 'varchar' })
  to_currency_code: string;

  @ManyToOne(() => Currency, { nullable: false })
  @JoinColumn({ name: ExchangeRateColumnName.FROM_CURRENCY })
  from_currency: Currency;

  @ManyToOne(() => Currency, { nullable: false })
  @JoinColumn({ name: ExchangeRateColumnName.TO_CURRENCY })
  to_currency: Currency;

  @ApiProperty({ type: Date, format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: Date, format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: 200 })
  @Column({ type: 'decimal' })
  exchange_rate: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Currency } from 'src/modules/currency/models/currency.entity';
import { User } from 'src/modules/user/models/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 123456 })
  @Column({ unique: true })
  account_number: number;

  @ApiProperty({ example: 100000 })
  @Column({ type: 'double precision' })
  balance: number;

  @ApiProperty({ example: 'USD' })
  @ManyToOne(() => Currency, { nullable: false })
  @JoinColumn({ name: 'currency_signature' })
  currency: Currency;

  @ApiProperty({ example: 1 })
  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;
}

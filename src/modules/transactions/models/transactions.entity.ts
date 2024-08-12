import { ApiProperty } from '@nestjs/swagger';
import { Account } from 'src/modules/account/models/account.entity';
import { Currency } from 'src/modules/currency/models/currency.entity';
import { User } from 'src/modules/user/models/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: { id: 50 } })
  @ManyToOne(() => User, { cascade: ['soft-remove'] })
  @JoinColumn()
  user: User;

  @ApiProperty({ example: Account })
  @ManyToOne(() => Account, (account) => account.accountNumber)
  @JoinColumn({ referencedColumnName: 'accountNumber', name: 'fromAccountNumber' })
  fromAccount: Account;

  @ApiProperty({ example: Account })
  @ManyToOne(() => Account, (account) => account.balance)
  @JoinColumn({ referencedColumnName: 'accountNumber', name: 'toAccountNumber' })
  toAccount: Account;

  @ApiProperty({ example: 2000 })
  @Column({ type: 'double precision' })
  totalAmount: number;

  @ApiProperty({ example: Currency })
  @ManyToOne(() => Currency, (currency) => currency.currency_signature)
  currency: Currency;

  @ApiProperty({ type: Date, format: 'date-time' })
  @CreateDateColumn()
  timeStamp: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

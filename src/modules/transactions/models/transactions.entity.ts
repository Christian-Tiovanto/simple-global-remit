import { Account } from 'src/modules/account/models/account.entity';
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

  @ManyToOne(() => User, { cascade: ['soft-remove'] })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Account, (account) => account.accountNumber)
  @JoinColumn({ referencedColumnName: 'accountNumber', name: 'fromAccountNumber' })
  fromAccount: Account;

  @ManyToOne(() => Account, (account) => account.accountNumber)
  @JoinColumn({ referencedColumnName: 'accountNumber', name: 'toAccountNumber' })
  toAccount: Account;

  @Column({ type: 'double precision' })
  totalAmount: number;

  @Column()
  currency: string;

  @CreateDateColumn()
  timeStamp: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

import { TransactionStatus } from 'src/enums/transaction-status';
import { Transaction } from 'src/modules/transactions/models/transactions.entity';
import { User } from 'src/modules/user/models/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransactionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TransactionStatus, nullable: true })
  previous_state: string;

  @Column({ type: 'enum', enum: TransactionStatus })
  current_state: string;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'modified_by' })
  modified_by: User;

  @ManyToOne(() => Transaction, (transaction) => transaction.id)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
}

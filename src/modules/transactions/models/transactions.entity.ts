import { User } from 'src/modules/user/models/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.fromTransactions)
  fromUser: User;

  @ManyToOne(() => User, (user) => user.sentTransactions)
  toUser: User;

  @Column()
  totalAmount: number;

  @Column()
  currency: string;

  @CreateDateColumn()
  timeStamp: Date;
}

import { Account } from 'src/modules/account/models/account.entity';
import { User } from 'src/modules/user/models/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Account)
  fromAccount: Account;

  @ManyToOne(() => Account)
  toAccount: Account;

  @Column()
  totalAmount: number;

  @Column()
  currency: string;

  @CreateDateColumn()
  timeStamp: Date;
}

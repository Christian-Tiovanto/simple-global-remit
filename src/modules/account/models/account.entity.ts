import { Currency } from 'src/modules/currency/models/currency.entity';
import { User } from 'src/modules/user/models/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  accountNumber: number;

  @Column({ type: 'double precision' })
  balance: number;

  @ManyToOne(() => Currency, { nullable: false })
  @JoinColumn({ name: 'currency_signature' })
  currency: Currency;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;
}

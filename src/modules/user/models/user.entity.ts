import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Transaction } from 'src/modules/transactions/models/transactions.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Transaction, (transaction) => transaction.toUser)
  sentTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.fromUser)
  fromTransactions: Transaction[];
}

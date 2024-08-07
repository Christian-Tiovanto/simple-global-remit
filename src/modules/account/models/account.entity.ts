import { User } from 'src/modules/user/models/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  accountNumber: number;

  @Column()
  balance: number;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;
}

import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { cascade: ['soft-remove'] })
  @JoinColumn()
  user: User;

  @ApiProperty({ example: 'testing' })
  @Column({ nullable: false })
  sender_name: string;

  @ApiProperty({ example: 'testing receiver' })
  @Column({ nullable: false })
  receiver_name: string;

  @ApiProperty({ example: 123456 })
  @Column()
  to_account: number;

  @ApiProperty({ example: 2000 })
  @Column({ type: 'double precision' })
  total_amount: number;

  @ApiProperty({ example: 'USD' })
  @Column()
  currency: string;

  @ApiProperty({ example: 0.005 })
  @Column({ type: 'decimal' })
  rate: number;

  @ApiProperty({ example: 40000 })
  @Column({ type: 'decimal' })
  fee: number;

  @ApiProperty({ example: 'SGP' })
  @Column()
  destination_country: string;

  @ApiProperty({ type: Date, format: 'date-time' })
  @CreateDateColumn()
  timeStamp: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

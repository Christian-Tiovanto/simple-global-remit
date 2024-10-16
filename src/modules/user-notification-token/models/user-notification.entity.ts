import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserNotification {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 1 })
  @Column({ name: 'user_id', type: 'int' })
  user_id!: number;

  @ApiProperty({
    example:
      'dXjDHdbC9Uo:APA91bHsAu0GWV9TBNb7-kDWkutOggyvzTnuVmhctE_5FDAErGCwicqdEcLFjMbIvnQyFHb_b2SZPg9qnRxs1vcqQ_uCTmK7RFG5u5zDHl_MLL62KKftVa5usY-EuU3IdqdLMI9MLFrC',
  })
  @Column({ name: 'token', type: 'text' })
  token: string;

  @ApiProperty({ example: '2021-04-01T02:51:20.683Z' })
  @CreateDateColumn({ name: 'created_at' })
  created_at?: string;

  @ApiProperty({ example: '2021-04-01T02:51:20.683Z' })
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at?: string;

  @OneToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

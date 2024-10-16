import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/enums/user-role';
@Entity()
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'christiantiovanto1@gmail.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'christian' })
  @Column({ name: 'first_name' })
  first_name: string;

  @ApiProperty({ example: 'tiovanto' })
  @Column({ type: 'varchar', name: 'last_name' })
  last_name: string;

  @ApiProperty({ required: false })
  @Column({ default: true })
  is_active: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @ApiProperty({ example: '123456' })
  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
  role: Role;

  @Exclude()
  @Column({ default: '' })
  otp_secret_key!: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  is_verified: boolean;
}

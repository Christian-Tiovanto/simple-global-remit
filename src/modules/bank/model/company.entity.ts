import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Jeffry Global Remit' })
  @Column()
  company_name: string;

  @ApiProperty({ example: 123456 })
  @Column({ unique: true })
  company_account_number: number;

  @ApiProperty({ example: 'Simple Global Remit' })
  @Column()
  company_account_name: string;

  @ApiProperty({ example: 'BCA' })
  @Column()
  company_account_type: string;
}

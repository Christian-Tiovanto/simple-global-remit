import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Currency {
  @ApiProperty({ example: 'USD' })
  @PrimaryColumn({ length: 3, unique: true })
  currency_signature: string;

  @ApiProperty({ example: 'US Dollar' })
  @Column()
  currency_name: string;
}

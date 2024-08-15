import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdatePaidTransactionStatusDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;
}

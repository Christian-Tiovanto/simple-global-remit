import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { TransactionStatus } from 'src/enums/transaction-status';

export class UpdateTransactionStatusDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: TransactionStatus.SENDING })
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}

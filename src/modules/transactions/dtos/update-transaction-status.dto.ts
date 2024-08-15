import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { TransactionStatus } from 'src/enums/transaction-status';
import { parseNumber } from 'src/utils/parse-number-transform';

export class UpdateTransactionStatusDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Transform(parseNumber)
  id: number;

  @ApiProperty({ example: TransactionStatus.SENDING })
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}

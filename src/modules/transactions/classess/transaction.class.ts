import { ApiProperty, IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { parseNumber } from 'src/utils/parse-number-transform';
import { Transaction } from '../models/transactions.entity';
import { Account } from 'src/modules/account/models/account.entity';

export class CreateTransactionQuery {
  @ApiProperty({ example: 1234567 })
  @Transform(parseNumber)
  @IsNumber()
  'receiver-account': number;

  @ApiProperty({ example: 100 })
  @Transform(parseNumber)
  @IsNumber()
  amount: number;
}

export class GetToAccountProperty extends PickType(Account, ['accountNumber', 'id'] as const) {}
export class GetTransactionProperty extends OmitType(Transaction, [
  'fromAccount',
  'currency',
  'user',
  'toAccount',
] as const) {
  @ApiProperty()
  toAccount: GetToAccountProperty;
}

export class GetTransactionHistoryResponse extends IntersectionType(GetToAccountProperty, GetTransactionProperty) {}

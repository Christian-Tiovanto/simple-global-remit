import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { parseNumber } from 'src/utils/parse-number-transform';

export class CreateTransactionQuery {
  @Transform(parseNumber)
  @IsNumber()
  'receiver-account': number;

  @Transform(parseNumber)
  @IsNumber()
  amount: number;
}

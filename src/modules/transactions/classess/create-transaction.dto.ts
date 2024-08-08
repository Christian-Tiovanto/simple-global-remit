import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { parseNumber } from 'src/utils/parse-number-transform';

export class CreateTransactionQuery {
  @Transform(parseNumber)
  @IsNumber()
  'receiver-account': number;

  @Transform(parseNumber)
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;
}

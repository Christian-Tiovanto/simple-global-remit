import { Transform } from 'class-transformer';
import { IsNumber, IsString, Length } from 'class-validator';
import { parseNumber } from 'src/utils/parse-number-transform';

export class ConvertExchangeValueDto {
  @IsString()
  @Length(3, 3)
  toCurrency: string;

  @IsNumber()
  @Transform(parseNumber)
  amount: number;
}

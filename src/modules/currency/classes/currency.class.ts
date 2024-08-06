import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber } from 'class-validator';
import { parseBoolean } from 'src/utils/parse-boolean-transform';

export class ConversionValueQuery {
  @IsBoolean()
  @Transform(parseBoolean)
  reverse: boolean;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  amount: number;
}

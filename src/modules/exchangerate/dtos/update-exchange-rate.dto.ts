import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsAlpha, IsNumber } from 'class-validator';
import { parseNumber } from 'src/utils/parse-number-transform';

export class UpdateExchangeRateDto {
  @ApiProperty({ example: 300 })
  @IsNumber()
  @Transform(parseNumber)
  exchange_rate: number;

  @ApiProperty({ example: 'EUR' })
  @IsAlpha()
  to_currency: string;
}

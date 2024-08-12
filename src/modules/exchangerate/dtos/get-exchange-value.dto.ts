import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, Length, Min } from 'class-validator';
import { parseNumber } from 'src/utils/parse-number-transform';

export class ConvertExchangeValueDto {
  @ApiProperty({ example: 'USD', required: true })
  @IsString()
  @Length(3, 3)
  toCurrency: string;

  @ApiProperty({ example: 10000, required: true })
  @IsNumber()
  @Min(0, { message: 'Amount must not be negative' })
  @Transform(parseNumber)
  amount: number;
}

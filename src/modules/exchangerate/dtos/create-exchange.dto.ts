import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateExchangeDto {
  @ApiProperty({ example: 'USD' })
  @IsString()
  fromCurrency: string;

  @ApiProperty({ example: 'EUR' })
  @IsString()
  toCurrency: string;

  @ApiProperty({ example: 200 })
  @IsNumber()
  exchangerate: number;
}

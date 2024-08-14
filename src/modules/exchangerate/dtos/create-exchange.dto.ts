import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateExchangeDto {
  @ApiProperty({ example: 'EUR' })
  @IsString()
  to_currency: string;

  @ApiProperty({ example: 200 })
  @IsNumber()
  exchange_rate: number;
}

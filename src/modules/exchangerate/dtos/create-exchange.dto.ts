import { IsNumber, IsString } from 'class-validator';

export class CreateExchangeDto {
  @IsString()
  fromCurrency: string;

  @IsString()
  toCurrency: string;

  @IsNumber()
  exchangerate: number;
}

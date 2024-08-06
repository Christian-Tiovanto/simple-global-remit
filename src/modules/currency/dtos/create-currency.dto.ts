import { IsNumber, IsString, Length } from 'class-validator';

export class CreateCurrencyDto {
  @IsString({ message: 'Currency Signature can only have 3 character' })
  @Length(3, 3)
  currency_signature: string;

  @IsString()
  currency_name: string;

  @IsNumber({}, { message: 'Invalid Rate, please input a valid number' })
  conversion_rate_to_idr: number;
}

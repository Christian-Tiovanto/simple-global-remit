import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({ example: 'USD' })
  @IsString({ message: 'Currency Signature can only have 3 character' })
  @Length(3, 3)
  currency_signature: string;

  @ApiProperty({ example: 'US Dollar' })
  @IsString()
  currency_name: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, Length } from 'class-validator';
import { parseNumber } from 'src/utils/parse-number-transform';

export class AddCountryCurrencyDto {
  @ApiProperty({ example: 'IDN' })
  @IsString({ message: 'country  signature can only be string' })
  @Length(3, 3, { message: 'Country Signature must only be 3 characters' })
  country_signature: string;

  @ApiProperty({ example: 'IDR' })
  @IsString({ message: 'country Currency signature can only be string' })
  @Length(3, 3, { message: 'Country Currency Signature must only be 3 characters' })
  country_currency: string;

  @ApiProperty({ default: 40000, nullable: true })
  @Transform(parseNumber)
  @IsNumber()
  fee: number;
}

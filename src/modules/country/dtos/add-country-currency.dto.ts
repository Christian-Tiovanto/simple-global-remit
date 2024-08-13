import { IsString, Length } from 'class-validator';

export class AddCountryCurrencyDto {
  @IsString({ message: 'country  signature can only be string' })
  @Length(3, 3, { message: 'Country Signature must only be 3 characters' })
  country_signature: string;

  @IsString({ message: 'country Currency signature can only be string' })
  @Length(3, 3, { message: 'Country Currency Signature must only be 3 characters' })
  country_currency: string;
}

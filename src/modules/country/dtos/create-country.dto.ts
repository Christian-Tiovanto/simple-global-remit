import { IsString, Length } from 'class-validator';

export class CreateCountryDto {
  @Length(3, 3, { message: 'Country Signature must only contain 3 characters' })
  @IsString({ message: 'country signature must be a string' })
  country_signature: string;

  @IsString({ message: 'country name must be a string' })
  country_name: string;
}

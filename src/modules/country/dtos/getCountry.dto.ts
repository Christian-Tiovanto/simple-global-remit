import { IsAlpha } from 'class-validator';

export class GetCountryDto {
  @IsAlpha()
  country_signature: string;
}

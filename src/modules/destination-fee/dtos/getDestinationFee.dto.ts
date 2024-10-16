import { IsAlpha } from 'class-validator';

export class getDestinationFeeDto {
  @IsAlpha()
  from_country: string;

  @IsAlpha()
  to_country: string;
}

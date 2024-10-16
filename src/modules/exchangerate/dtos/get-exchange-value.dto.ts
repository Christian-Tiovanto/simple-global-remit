import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsString, Length } from 'class-validator';
export class ConvertExchangeValueDto {
  @ApiProperty({ example: 'USD', required: true })
  @IsString()
  @Length(3, 3)
  to_currency: string;

  @ApiProperty({ example: 'SGP' })
  @IsAlpha()
  destination_country: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEnum, IsString, Length } from 'class-validator';
import { AmountType } from 'src/enums/amount-type';

export class ConvertExchangeValueDto {
  @ApiProperty({ example: 'USD', required: true })
  @IsString()
  @Length(3, 3)
  to_currency: string;

  @ApiProperty({ enum: AmountType, required: true })
  @IsEnum(AmountType)
  amount_type: AmountType;

  @ApiProperty({ example: 'SGP' })
  @IsAlpha()
  destination_country: string;
}

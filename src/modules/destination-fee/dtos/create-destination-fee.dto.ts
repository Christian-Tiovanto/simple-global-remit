import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsNumber } from 'class-validator';

export class CreateDestinationFeeDto {
  @ApiProperty({ example: 'IDN' })
  @IsAlpha()
  from_country: string;

  @ApiProperty({ example: 'SGP' })
  @IsAlpha()
  to_country: string;

  @ApiProperty({ example: 40000 })
  @IsNumber()
  fee: number;
}

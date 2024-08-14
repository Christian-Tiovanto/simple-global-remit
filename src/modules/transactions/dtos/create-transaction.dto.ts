import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsAlpha, IsNumber, IsString, Length } from 'class-validator';
import { parseNumber } from 'src/utils/parse-number-transform';

export class CreateTransactionDto {
  @ApiProperty({ example: 1234567 })
  @Transform(parseNumber)
  @IsNumber()
  to_account: number;

  @ApiProperty({ example: 'testing' })
  @IsAlpha()
  sender_name: string;

  @ApiProperty({ example: 'testing' })
  @IsAlpha()
  receiver_name: string;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @Length(3, 3)
  currency: string;

  @ApiProperty({ example: 100 })
  @Transform(parseNumber)
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'SGP' })
  @IsAlpha()
  destination_country: string;

  @ApiProperty({ example: 0.005 })
  @IsNumber()
  fee: number;

  @ApiProperty({ example: 40000 })
  @IsNumber()
  rate: number;
}

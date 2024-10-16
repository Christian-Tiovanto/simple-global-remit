import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { parseNumber } from 'src/utils/parse-number-transform';

export class CreateAccountDto {
  @ApiProperty({ example: 123456 })
  @Transform(parseNumber)
  @IsNumber()
  account_number: number;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  balance: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  user_id: number;

  @ApiProperty({ example: 'EUR' })
  @IsString()
  currency: string;
}

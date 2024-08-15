import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { parseNumber } from 'src/utils/parse-number-transform';

export class UpdatePaidTransactionStatusDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Transform(parseNumber)
  id: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  photo: any;
}

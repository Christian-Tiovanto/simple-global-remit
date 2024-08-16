import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCompanyBankDto {
  @ApiProperty({ example: 'Jeffry Global Remit' })
  @IsString()
  company_name: string;

  @ApiProperty({ example: 123456 })
  @IsNumber()
  company_account_number: number;

  @ApiProperty({ example: 'Simple Global Remit' })
  @IsString()
  company_account_name: string;
}

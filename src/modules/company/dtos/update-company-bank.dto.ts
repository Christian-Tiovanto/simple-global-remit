import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { CreateCompanyBankDto } from './create-company-bank.dto';
import { IsNumber } from 'class-validator';
export class UpdateCompanyBankDto extends IntersectionType(CreateCompanyBankDto) {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;
}

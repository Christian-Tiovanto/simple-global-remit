import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Company } from '../model/company.entity';
import { CreateCompanyBankDto } from '../dtos/create-company-bank.dto';

class CreateCompanyBankListResponse extends OmitType(CreateCompanyBankDto, ['company_name'] as const) {}
export class GetCompanyBankListResponse {
  @ApiProperty({ example: 'Jeffry Global Remit' })
  company_name: Company['company_name'];

  @ApiProperty({ type: [CreateCompanyBankListResponse] })
  company_account: CreateCompanyBankListResponse;
}

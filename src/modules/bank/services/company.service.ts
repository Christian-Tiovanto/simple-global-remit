import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../model/company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyBankDto } from '../dtos/createCompanyBankDto';

@Injectable()
export class CompanyService {
  constructor(@InjectRepository(Company) private companyRepository: Repository<Company>) {}

  async createCompanyBank(createCompanyBankDto: CreateCompanyBankDto) {
    const company = await this.companyRepository.create(createCompanyBankDto);
    await this.companyRepository.save(company);
    return company;
  }

  async getCompanyBankList() {
    const companys = await this.companyRepository.find();
    return {
      company_name: companys[0].company_name,
      company_account: companys.map((company) => ({
        company_account_number: company.company_account_number,
        company_account_name: company.company_account_name,
        company_account_type: company.company_account_type,
      })),
    };
  }
}

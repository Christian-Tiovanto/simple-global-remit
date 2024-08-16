import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from '../model/bank.entity';
import { Repository } from 'typeorm';
import { CreateCompanyBankDto } from '../dtos/createCompanyBankDto';

@Injectable()
export class BankService {
  constructor(@InjectRepository(Bank) private bankRepository: Repository<Bank>) {}

  async createCompanyBank(createCompanyBankDto: CreateCompanyBankDto) {
    const bank = await this.bankRepository.create(createCompanyBankDto);
    await this.bankRepository.save(bank);
    return bank;
  }

  async getCompanyBankList() {
    const banks = await this.bankRepository.find();
    return banks;
  }
}

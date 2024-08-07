import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../models/account.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { ErrorCode } from 'src/enums/error-code';
import { DuplicateAccountException } from 'src/exceptions/duplicate-account.exception';

@Injectable()
export class AccountService {
  constructor(@InjectRepository(Account) private accountRepository: Repository<Account>) {}

  async createAccount(createAccountDto: CreateAccountDto) {
    try {
      const account = this.accountRepository.create(createAccountDto);
      await this.accountRepository.save(account);
      return account;
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code === ErrorCode.POSTGRES_UNIQUE_VIOLATION_ERROR_CODE) {
        throw new DuplicateAccountException(`${createAccountDto.accountNumber} already register`, {
          key: 'accountNumber',
          value: createAccountDto.accountNumber.toString(),
        });
      }
    }
  }
}

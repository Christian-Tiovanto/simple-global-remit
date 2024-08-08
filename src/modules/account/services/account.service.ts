import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../models/account.entity';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { ErrorCode } from 'src/enums/error-code';
import { DuplicateAccountException } from 'src/exceptions/duplicate-account.exception';
import { UserService } from 'src/modules/user/services/user.service';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/modules/user/models/user.entity';
import { AccountListTransaction } from 'src/interfaces/account-list-transaction';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    private userService: UserService,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto) {
    try {
      const user = plainToInstance(User, await this.userService.getUserbyId(createAccountDto.userId));
      if (!user) throw new BadRequestException('There is no user with that id');
      const account = await this.accountRepository.create({ ...createAccountDto, user });
      await this.accountRepository.save(account);
      return account;
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      if (
        err instanceof QueryFailedError &&
        (err as any).detail.includes('userId') &&
        err.driverError.code === ErrorCode.POSTGRES_UNIQUE_VIOLATION_ERROR_CODE
      ) {
        throw new DuplicateAccountException(
          `${createAccountDto.accountNumber} already register`,
          {
            key: 'user',
            value: createAccountDto.userId.toString(),
          },
          'Duplicate User Account',
        );
      } else {
        throw new DuplicateAccountException(
          `${createAccountDto.accountNumber} already register`,
          {
            key: 'accountNumber',
            value: createAccountDto.accountNumber.toString(),
          },
          'Duplicate Account Number',
        );
      }
    }
  }
  async getUserAccount(id: number) {
    const account = await this.accountRepository.findOne({ where: { user: { id } } });
    if (!account) throw new BadRequestException('this user doesnt have an account yet');
    return account;
  }

  async getAccountByNumber(accountNumber: number) {
    const account = await this.accountRepository.findOne({ where: { accountNumber } });
    if (!account) throw new BadRequestException('There is no account with that number');
    return account;
  }

  async getUserAccountWithManager(entityManager: EntityManager, id: number) {
    const account = await entityManager.findOne(Account, { where: { user: { id } } });
    if (!account) throw new BadRequestException('this user doesnt have an account yet');
    return account;
  }

  async getAccountByNumberWithManager(entityManager: EntityManager, accountNumber: number) {
    const account = await entityManager.findOne(Account, { where: { accountNumber } });
    return account;
  }

  async updateUserAndReceiverBalanceWithManager(
    entityManager: EntityManager,
    accountList: AccountListTransaction,
    amount: number,
  ) {
    accountList.userAccount.balance -= amount;
    if (accountList.userAccount.balance < 0)
      throw new BadRequestException('you dont have enough money in your account');
    accountList.receiverAccount.balance += amount;
    await entityManager.save(accountList.userAccount);
    await entityManager.save(accountList.receiverAccount);
  }
}

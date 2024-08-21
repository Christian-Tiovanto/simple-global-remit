import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../models/account.entity';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { ErrorCode } from 'src/enums/error-code';
import { DuplicateAccountException } from 'src/exceptions/duplicate-account.exception';
import { UserService } from 'src/modules/user/services/user.service';
import { AccountListTransaction } from 'src/interfaces/account-list-transaction.interface';
import { TransactionAmountUpdate } from 'src/interfaces/transaction-amount-update.interface';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    private userService: UserService,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto) {
    try {
      if (createAccountDto.currency.length != 3)
        throw new BadRequestException('Currency Signature must be 3 character');
      const account = await this.accountRepository.create({
        ...createAccountDto,
        user: { id: createAccountDto.user_id },
        currency: { currency_signature: createAccountDto.currency },
      });
      await this.accountRepository.save(account);
      return account;
    } catch (err) {
      this.createAccountErrorHandler(err, createAccountDto);
    }
  }
  private createAccountErrorHandler(err: any, createAccountDto: CreateAccountDto) {
    if (err instanceof BadRequestException) throw err;
    if (
      err instanceof QueryFailedError &&
      err.driverError.code === ErrorCode.POSTGRES_FOREIGN_KEY_CONSTRAINT_ERROR_CODE &&
      err.driverError.detail.includes('currency')
    )
      throw new BadRequestException('there is no currency with that signature');
    if (
      err instanceof QueryFailedError &&
      err.driverError.code === ErrorCode.POSTGRES_FOREIGN_KEY_CONSTRAINT_ERROR_CODE &&
      err.driverError.detail.includes('user')
    )
      throw new BadRequestException('there is no user with that id');
    if (
      err instanceof QueryFailedError &&
      (err as any).detail.includes('userId') &&
      err.driverError.code === ErrorCode.POSTGRES_UNIQUE_VIOLATION_ERROR_CODE
    ) {
      throw new DuplicateAccountException(
        `${createAccountDto.user_id} already exist`,
        {
          key: 'user',
          value: createAccountDto.user_id.toString(),
        },
        'Duplicate User Account',
      );
    }
    if (err instanceof QueryFailedError && err.driverError.code === ErrorCode.POSTGRES_UNIQUE_VIOLATION_ERROR_CODE) {
      throw new DuplicateAccountException(
        `${createAccountDto.account_number} already register`,
        {
          key: 'accountNumber',
          value: createAccountDto.account_number.toString(),
        },
        'Duplicate Account Number',
      );
    }
    throw err;
  }

  async getUserAccount(id: number) {
    const account = await this.accountRepository.findOne({ where: { user: { id } }, relations: { currency: true } });
    if (!account) throw new BadRequestException('this user doesnt have an account yet');
    return account;
  }

  async getAccountByNumber(accountNumber: number) {
    const account = await this.accountRepository.findOne({ where: { account_number: accountNumber } });
    if (!account) throw new BadRequestException('There is no account with that number');
    return account;
  }

  async getUserAccountWithManager(entityManager: EntityManager, id: number) {
    const account = await entityManager.findOne(Account, { where: { user: { id } }, relations: { currency: true } });
    if (!account) throw new BadRequestException('this user doesnt have an account yet');
    return account;
  }

  async getAccountByNumberWithManager(entityManager: EntityManager, accountNumber: number) {
    const account = await entityManager.findOne(Account, {
      where: { account_number: accountNumber },
      relations: { currency: true },
    });
    if (!account) throw new BadRequestException('there is no account with that number');
    return account;
  }

  async updateUserAndReceiverBalanceWithManager(
    entityManager: EntityManager,
    accountList: AccountListTransaction,
    amount: TransactionAmountUpdate,
  ) {
    accountList.userAccount.balance -= amount.subtractUserAccount;
    if (accountList.userAccount.balance < 0)
      throw new BadRequestException('you dont have enough money in your account');
    accountList.receiverAccount.balance += amount.addReceiverAccount;
    await entityManager.save(accountList.userAccount);
    await entityManager.save(accountList.receiverAccount);
  }
}

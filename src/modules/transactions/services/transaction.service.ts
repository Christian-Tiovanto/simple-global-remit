import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../models/transactions.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateTransactionQuery } from '../classess/create-transaction.dto';
import { AccountService } from 'src/modules/account/services/account.service';
import { CurrencyService } from 'src/modules/currency/services/currency.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    private accountService: AccountService,
    private currencyService: CurrencyService,
  ) {}

  async getUserTransactionHistory(id: number) {
    const transactions = await this.transactionRepository.find({ where: { user: { id } } });
    return transactions;
  }
  async createTransaction(createTransactionQuery: CreateTransactionQuery, userId: number) {
    const amount = await this.transactionRepository.manager.transaction(async (entityManager: EntityManager) => {
      const amount = (
        await this.currencyService.getConversionValue(createTransactionQuery.currency, {
          amount: createTransactionQuery.amount,
          reverse: false,
        })
      ).toFixed(2);
      const formattedAmount = Number(amount);
      const userAccount = await this.accountService.getUserAccountWithManager(entityManager, userId);
      const receiverAccount = await this.accountService.getAccountByNumberWithManager(
        entityManager,
        createTransactionQuery['receiver-account'],
      );
      if (userAccount.id === receiverAccount.id) throw new BadRequestException('Cannot send money to your own account');
      await this.accountService.updateUserAndReceiverBalanceWithManager(
        entityManager,
        { userAccount, receiverAccount },
        formattedAmount,
      );
      const transaction = await entityManager.create(Transaction, {
        fromAccount: userAccount,
        toAccount: receiverAccount,
        user: { id: userId },
        totalAmount: formattedAmount,
        currency: createTransactionQuery.currency,
      });
      await entityManager.save(transaction);
      return formattedAmount;
    });
    return amount;
  }
}

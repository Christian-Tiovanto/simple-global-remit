import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../models/transactions.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateTransactionQuery } from '../classess/create-transaction.dto';
import { AccountService } from 'src/modules/account/services/account.service';
import { CurrencyService } from 'src/modules/currency/services/currency.service';
import { Currency } from 'src/modules/currency/models/currency.entity';

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
      const { userAccount, receiverAccount } = await this.getAccountForTransaction(
        entityManager,
        userId,
        createTransactionQuery['receiver-account'],
      );
      const formattedAmount = await this.calculateFormattedAmount(
        receiverAccount.currency.currency_signature,
        createTransactionQuery.amount,
      );
      await this.accountService.updateUserAndReceiverBalanceWithManager(
        entityManager,
        { userAccount, receiverAccount },
        { subtractUserAccount: createTransactionQuery.amount, addReceiverAccount: formattedAmount },
      );
      const transaction = await entityManager.create(Transaction, {
        fromAccount: userAccount,
        toAccount: receiverAccount,
        user: { id: userId },
        totalAmount: formattedAmount,
        currency: receiverAccount.currency,
      });
      await entityManager.save(transaction);
      return formattedAmount;
    });
    return amount;
  }

  private async calculateFormattedAmount(
    receiverAccountCurrency: Currency['currency_signature'],
    amount: CreateTransactionQuery['amount'],
  ): Promise<number> {
    const conversionValue = await this.currencyService.getConversionValue(receiverAccountCurrency, {
      amount: amount,
      reverse: false,
    });
    return Number(conversionValue.toFixed(2));
  }
  private async getAccountForTransaction(
    entityManager: EntityManager,
    senderId: number,
    receiverNumber: CreateTransactionQuery['receiver-account'],
  ) {
    const userAccount = await this.accountService.getUserAccountWithManager(entityManager, senderId);
    const receiverAccount = await this.accountService.getAccountByNumberWithManager(entityManager, receiverNumber);
    if (userAccount.id === receiverAccount.id) throw new BadRequestException('Cannot send money to your own account');
    return { userAccount, receiverAccount };
  }
}

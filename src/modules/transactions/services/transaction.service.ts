import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../models/transactions.entity';
import { EntityManager, Repository } from 'typeorm';
import { ExchangeRateService } from 'src/modules/exchangerate/services/exhange-rate.service';
import { CalculateTransactionAmount } from 'src/interfaces/calculate-transaction-amount';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { getDestinationFeeDto } from 'src/modules/destination-fee/dtos/getDestinationFee.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    private exchangeService: ExchangeRateService,
  ) {}

  async getUserTransactionHistory(id: number) {
    const transactions = await this.transactionRepository.find({
      where: { user: { id } },
    });
    return transactions;
  }
  async createTransaction(createTransactionDto: CreateTransactionDto, userId: number) {
    const amount = await this.transactionRepository.manager.transaction(async (entityManager: EntityManager) => {
      const { currency, amount, to_account, sender_name, destination_country, receiver_name, fee, rate } =
        createTransactionDto;
      const formattedAmount = await this.calculateAmount(
        {
          toCurrency: currency,
          amount: amount,
        },
        { to_country: destination_country, from_country: 'IDN' },
      );
      await this.validateRateFromFE(currency, destination_country, rate);
      const transaction = await entityManager.create(Transaction, {
        user: { id: userId },
        to_account: to_account,
        sender_name,
        total_amount: Number((formattedAmount + fee).toFixed(2)),
        currency: currency,
        destination_country,
        receiver_name,
        fee,
        rate,
      });
      await entityManager.save(transaction);
      transaction.user = undefined;
      return transaction;
    });
    return amount;
  }

  private async validateRateFromFE(currency: string, destination_country: string, rate: number) {
    const exchangeRate = await this.exchangeService.getExchangeRate({ to_currency: currency, destination_country });
    if (rate != exchangeRate.rate) throw new BadRequestException(`current exchange rate is ${exchangeRate.rate}`);
  }

  private async calculateAmount(
    calculateTransaction: CalculateTransactionAmount,
    destination: getDestinationFeeDto,
  ): Promise<number> {
    const conversionValue = await this.exchangeService.getAmountforTransaction(
      {
        amount: calculateTransaction.amount,
        toCurrency: calculateTransaction.toCurrency,
      },
      destination,
    );
    return Number(conversionValue.toFixed(2));
  }
}

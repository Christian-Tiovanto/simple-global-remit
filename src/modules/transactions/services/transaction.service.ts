import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../models/transactions.entity';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
import { ExchangeRateService } from 'src/modules/exchangerate/services/exhange-rate.service';
import { CalculateTransactionAmount } from 'src/interfaces/calculate-transaction-amount';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { getDestinationFeeDto } from 'src/modules/destination-fee/dtos/getDestinationFee.dto';
import { UpdatePaidTransactionStatusDto } from '../dtos/update-paid-transaction-status.dto';
import { TransactionStatus } from 'src/enums/transaction-status';
import { UpdateTransactionStatusDto } from '../dtos/update-transaction-status.dto';
import { generateSerial } from 'src/utils/generate-transaction-id';
import { TransactionLogService } from 'src/modules/transaction-log/services/transaction-log.service';
import { ValidationError } from 'src/exceptions/validation-error.exception';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    private exchangeService: ExchangeRateService,
    private transactionLogService: TransactionLogService,
  ) {}

  async getUserTransaction(id: number, status: TransactionStatus) {
    try {
      const transactions = await this.transactionRepository.find({
        where: { user: { id }, ...(status ? { status } : {}) },
      });
      return transactions;
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code === '22P02')
        throw new BadRequestException('invalid transaction status');
      throw err;
    }
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
        payment_price: Number((amount + fee).toFixed(2)),
        amount_received: Number(formattedAmount.toFixed(2)),
        currency: currency,
        destination_country,
        receiver_name,
        fee,
        rate,
      });
      await entityManager.save(transaction);
      transaction.transaction_id = generateSerial(transaction.id);
      await entityManager.save(transaction);
      await this.transactionLogService.createTransactionLogWithManager(entityManager, transaction, undefined, userId);
      transaction.user = undefined;
      return transaction;
    });
    return amount;
  }

  private async validateRateFromFE(currency: string, destination_country: string, rate: number) {
    const exchangeRate = await this.exchangeService.getExchangeRate({ to_currency: currency, destination_country });
    if (rate != exchangeRate.rate)
      throw new ValidationError(`current exchange rate is ${exchangeRate.rate}`, {
        key: ['exchange_rate'],
        value: [rate],
      });
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

  async updatePaidTransactionStatus(
    updatePaidTransactionStatusDto: UpdatePaidTransactionStatusDto,
    file: Express.Multer.File['path'],
    userId: number,
  ) {
    const { id } = updatePaidTransactionStatusDto;
    const transaction = await this.transactionRepository.findOne({ where: { id } });
    if (!transaction) throw new BadRequestException('there is no transaction with that id');
    const status = TransactionStatus.ONGOING;
    const previous_state = transaction.status;
    console.log(previous_state);
    transaction.status = status;
    transaction.photo_path = file;
    await this.transactionRepository.save(transaction);
    await this.transactionLogService.createTransactionLog(transaction, previous_state, userId);
    return transaction;
  }
  async updateTransactionStatus(updateTransactionStatusDto: UpdateTransactionStatusDto, userId: number) {
    const { id, status } = updateTransactionStatusDto;
    const transaction = await this.transactionRepository.findOne({ where: { id } });
    if (!transaction) throw new BadRequestException('there is no transaction with that id');
    const previous_state = transaction.status;
    transaction.status = status;
    await this.transactionRepository.save(transaction);
    await this.transactionLogService.createTransactionLog(transaction, previous_state, userId);
    return transaction;
  }

  async getTransactionPhoto(id: number) {
    const transaction = await this.transactionRepository.findOne({ where: { id } });
    if (!transaction) throw new BadRequestException('there is no transaction with that id');
    return transaction.photo_path;
  }

  async getAllTransactionByStatus(status: TransactionStatus) {
    try {
      const transactions = await this.transactionRepository.find({ where: { status } });
      return transactions;
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code === '22P02') {
        throw new BadRequestException('invalid status, please input a valid status(pending,ongoing,sending,completed)');
      }
    }
  }

  async getLoggedInUserSpesificTransaction(userId: number, transactionId: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { user: { id: userId }, id: transactionId },
    });
    if (!transaction) throw new BadRequestException('there is no transaction with that id');
    return transaction;
  }
}

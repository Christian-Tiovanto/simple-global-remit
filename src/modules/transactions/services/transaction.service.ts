import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../models/transactions.entity';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
import { ExchangeRateService } from 'src/modules/exchangerate/services/exhange-rate.service';
import { CalculateTransactionAmount } from 'src/interfaces/calculate-transaction-amount.interface';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { getDestinationFeeDto } from 'src/modules/destination-fee/dtos/getDestinationFee.dto';
import { UpdatePaidTransactionStatusDto } from '../dtos/update-paid-transaction-status.dto';
import { TransactionStatus } from 'src/enums/transaction-status';
import { UpdateTransactionStatusDto } from '../dtos/update-transaction-status.dto';
import { generateSerial } from 'src/utils/generate-transaction-id';
import { TransactionLogService } from 'src/modules/transaction-log/services/transaction-log.service';
import { ValidationError } from 'src/exceptions/validation-error.exception';
import { UserNotificationService } from 'src/modules/user-notification-token/services/user-notification.service';
import { User } from 'src/modules/user/models/user.entity';
import { TokenMessage } from 'firebase-admin/messaging';
import { UserNotification } from 'src/modules/user-notification-token/models/user-notification.entity';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    private exchangeService: ExchangeRateService,
    private transactionLogService: TransactionLogService,
    private userNotificationService: UserNotificationService,
    private userService: UserService,
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
    const { currency, amount, to_account, sender_name, destination_country, receiver_name, fee, rate } =
      createTransactionDto;
    const user = await this.userService.getUserbyId(userId);
    const transaction = await this.transactionRepository.manager.transaction(async (entityManager: EntityManager) => {
      const formattedAmount = await this.calculateAmount(
        {
          toCurrency: currency,
          amount: amount,
        },
        { to_country: destination_country, from_country: 'IDN' },
      );
      await this.validateRateFromFE(currency, destination_country, rate);
      const transaction = await entityManager.create(Transaction, {
        user,
        to_account: to_account,
        sender_name,
        payment_price: Number((amount + fee).toFixed(2)),
        amount_received: Number(amount.toFixed(2)),
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
    await this.sendNotificationToUser(user, transaction);
    return transaction;
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
    filePath: Express.Multer.File['path'],
    userId: number,
  ) {
    const transaction = await this.getTransactionById(updatePaidTransactionStatusDto.id);
    const previous_state = transaction.status;

    this.updateTransactionStatusAndPhoto(transaction, filePath);

    await this.transactionRepository.save(transaction);
    await this.transactionLogService.createTransactionLog(transaction, previous_state, userId);

    this.getUserAndSendNotificationToUser(userId, transaction);
    return transaction;
  }
  private updateTransactionStatusAndPhoto(transaction: Transaction, filePath: string) {
    const status = TransactionStatus.ONGOING;
    transaction.status = status;
    transaction.photo_path = filePath;
  }

  async updateTransactionStatus(updateTransactionStatusDto: UpdateTransactionStatusDto, userId: number) {
    const { id, status } = updateTransactionStatusDto;
    const transaction = await this.getTransactionById(id);
    const previous_state = transaction.status;
    transaction.status = status;
    await this.transactionRepository.save(transaction);
    await this.transactionLogService.createTransactionLog(transaction, previous_state, userId);
    this.getUserAndSendNotificationToUser(userId, transaction);

    return transaction;
  }
  private async getUserAndSendNotificationToUser(userId: number, transaction: Transaction) {
    const user = await this.userService.getUserbyId(userId);
    const userNotificationToken = await this.getUserNotificationToken(user);
    const message = this.buildTransactionMessage(userNotificationToken.token, transaction);
    this.userNotificationService.sendNotificationToUser(message);
  }
  private async sendNotificationToUser(user: User, transaction: Transaction) {
    const userNotificationToken = await this.getUserNotificationToken(user);
    const message = this.buildTransactionMessage(userNotificationToken.token, transaction);
    this.userNotificationService.sendNotificationToUser(message);
  }

  private async getUserNotificationToken(user: User): Promise<UserNotification> {
    return this.userNotificationService.getUserNotificationToken(user);
  }

  private buildTransactionMessage(token: string, transaction: Transaction): TokenMessage {
    return {
      token: token,
      notification: {
        title: 'Successfully created transaction',
        body: `Succesfully Create Transaction to ${transaction.receiver_name} with total amount ${transaction.amount_received}`,
      },
      data: {
        transaction_id: transaction.id.toString(),
        previous_status: '',
        current_status: 'pending',
      },
    };
  }

  async getTransactionPhoto(id: number) {
    const transaction = await this.getTransactionById(id);
    return transaction.photo_path;
  }

  private async getTransactionById(id: number) {
    return await this.transactionRepository.findOne({ where: { id } });
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

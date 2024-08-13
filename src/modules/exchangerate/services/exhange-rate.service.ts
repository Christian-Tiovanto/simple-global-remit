import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from '../models/exchange-rate.entity';
import { Repository } from 'typeorm';
import { CreateExchangeDto } from '../dtos/create-exchange.dto';
import { ConvertExchangeValueDto } from '../dtos/get-exchange-value.dto';
import { AccountService } from 'src/modules/account/services/account.service';
import { CalculateTransactionAmount } from 'src/interfaces/calculate-transaction-amount';
import { getConstraintError } from 'src/utils/get-error-constraint';
import { ExchangeRateColumnName } from 'src/enums/country-column';

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectRepository(ExchangeRate) private exchangeRepository: Repository<ExchangeRate>,
    private accountService: AccountService,
  ) {}

  async createExchange(createExchangeDto: CreateExchangeDto) {
    try {
      if (createExchangeDto.fromCurrency === createExchangeDto.toCurrency)
        throw new BadRequestException('cant create Exchange Rate from the same currency');
      const exchange = await this.exchangeRepository.manager.transaction(async (entityManager) => {
        const sql = `insert into exchange_rate ("${ExchangeRateColumnName.FROM_CURRENCY}" ,"${ExchangeRateColumnName.TO_CURRENCY}","exchangeRate") values ('${createExchangeDto.fromCurrency}','${createExchangeDto.toCurrency}','${createExchangeDto.exchangerate}') returning *`;
        const result = await entityManager.query(sql);

        const inverseSql = `insert into exchange_rate ("${ExchangeRateColumnName.TO_CURRENCY}" ,"${ExchangeRateColumnName.FROM_CURRENCY}","exchangeRate") values ('${createExchangeDto.fromCurrency}','${createExchangeDto.toCurrency}','${1 / createExchangeDto.exchangerate}') returning *`;
        const inverseResult = await entityManager.query(inverseSql);
        return result[0];
      });
      return exchange;
    } catch (error) {
      getConstraintError(error);
    }
  }

  async getUserExchangeTo(toCurr: ConvertExchangeValueDto['toCurrency'], userId: number) {
    const userAccCurr = await this.accountService.getUserAccount(userId);
    const exchangeValue = await this.exchangeRepository.findOne({
      where: {
        fromCurrency: { currency_signature: userAccCurr.currency.currency_signature },
        toCurrency: { currency_signature: toCurr },
      },
    });
    if (!exchangeValue)
      throw new BadRequestException(
        `There is no exchange rate from ${userAccCurr.currency.currency_signature} to ${toCurr} currency yet`,
      );
    return exchangeValue;
  }
  async getConvertedExchangeValue(convertExchangeValueDto: ConvertExchangeValueDto, userId: number) {
    const exchangeRate = await this.getUserExchangeTo(convertExchangeValueDto.toCurrency, userId);
    const amount = exchangeRate.exchangeRate * convertExchangeValueDto.amount;
    return amount;
  }
  async getAmountforTransaction(calculateTransactionArgs: CalculateTransactionAmount) {
    const exchangeValue = await this.exchangeRepository.findOne({
      where: {
        fromCurrency: { currency_signature: calculateTransactionArgs.fromCurrency },
        toCurrency: { currency_signature: calculateTransactionArgs.toCurrency },
      },
    });
    if (!exchangeValue)
      throw new BadRequestException(
        `There is no exchange rate from ${calculateTransactionArgs.fromCurrency} to ${calculateTransactionArgs.toCurrency} currency yet`,
      );
    const calculatedValue = exchangeValue.exchangeRate * calculateTransactionArgs.amount;
    const calculateFormattedAmount = Number(calculatedValue.toFixed(2));
    return calculateFormattedAmount;
  }
}

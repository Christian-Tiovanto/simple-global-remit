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
import { parseBoolean } from 'src/utils/parse-boolean-transform';

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectRepository(ExchangeRate) private exchangeRepository: Repository<ExchangeRate>,
    private accountService: AccountService,
  ) {}

  async createExchange(createExchangeDto: CreateExchangeDto) {
    try {
      if (createExchangeDto.from_currency === createExchangeDto.to_currency)
        throw new BadRequestException('cant create Exchange Rate from the same currency');
      const exchange = await this.exchangeRepository.manager.transaction(async (entityManager) => {
        const fromCurrency = ExchangeRateColumnName.FROM_CURRENCY;
        const toCurrency = ExchangeRateColumnName.TO_CURRENCY;
        const exchangeRate = ExchangeRateColumnName.EXCHANGE_RATE;
        const { from_currency, to_currency, exchange_rate } = createExchangeDto;

        const sql = `insert into exchange_rate ("${fromCurrency}" ,"${toCurrency}","${exchangeRate}") values ('${from_currency}','${to_currency}','${exchange_rate}') returning *`;
        const result = await entityManager.query(sql);

        const inverseSql = `insert into exchange_rate ("${toCurrency}" ,"${fromCurrency}","${exchangeRate}") values ('${from_currency}','${to_currency}','${1 / exchange_rate}') returning *`;
        const inverseResult = await entityManager.query(inverseSql);
        return result[0];
      });
      return exchange;
    } catch (error) {
      getConstraintError(error);
    }
  }

  async getConvertedExchangeValue(convertExchangeValueDto: ConvertExchangeValueDto) {
    const { to_currency, amount } = convertExchangeValueDto;
    const reverse = parseBoolean(convertExchangeValueDto.reverse);
    const exchangeRate = await this.exchangeRepository.findOne({
      where: {
        from_currency: { currency_signature: reverse ? to_currency : 'IDR' },
        to_currency: { currency_signature: reverse ? 'IDR' : to_currency },
      },
    });
    if (!exchangeRate)
      throw new BadRequestException(`there is no exchange rate from IDR to ${to_currency} or the other way around`);
    const exchangeValue = exchangeRate.exchange_rate * amount;
    return exchangeValue;
  }
  async getAmountforTransaction(calculateTransactionArgs: CalculateTransactionAmount) {
    const exchangeValue = await this.exchangeRepository.findOne({
      where: {
        from_currency: { currency_signature: calculateTransactionArgs.fromCurrency },
        to_currency: { currency_signature: calculateTransactionArgs.toCurrency },
      },
    });
    if (!exchangeValue)
      throw new BadRequestException(
        `There is no exchange rate from ${calculateTransactionArgs.fromCurrency} to ${calculateTransactionArgs.toCurrency} currency yet`,
      );
    const calculatedValue = exchangeValue.exchange_rate * calculateTransactionArgs.amount;
    const calculateFormattedAmount = Number(calculatedValue.toFixed(2));
    return calculateFormattedAmount;
  }
}

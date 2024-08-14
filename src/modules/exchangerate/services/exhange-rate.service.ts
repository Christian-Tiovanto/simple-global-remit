import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from '../models/exchange-rate.entity';
import { Repository } from 'typeorm';
import { CreateExchangeDto } from '../dtos/create-exchange.dto';
import { ConvertExchangeValueDto } from '../dtos/get-exchange-value.dto';
import { CalculateTransactionAmount } from 'src/interfaces/calculate-transaction-amount';
import { getConstraintError } from 'src/utils/get-error-constraint';
import { ExchangeRateColumnName } from 'src/enums/country-column';
import { DestinationFeeService } from 'src/modules/destination-fee/services/destination-fee.service';
import { getDestinationFeeDto } from 'src/modules/destination-fee/dtos/getDestinationFee.dto';
import { UpdateExchangeRateDto } from '../dtos/update-exchange-rate.dto';

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectRepository(ExchangeRate) private exchangeRepository: Repository<ExchangeRate>,
    private destinationFeeService: DestinationFeeService,
  ) {}

  async createExchange(createExchangeDto: CreateExchangeDto) {
    try {
      const exchange = await this.exchangeRepository.manager.transaction(async (entityManager) => {
        const fromCurrency = ExchangeRateColumnName.FROM_CURRENCY;
        const toCurrency = ExchangeRateColumnName.TO_CURRENCY;
        const exchangeRate = ExchangeRateColumnName.EXCHANGE_RATE;
        const { to_currency, exchange_rate } = createExchangeDto;

        const sql = `insert into exchange_rate ("${fromCurrency}" ,"${toCurrency}","${exchangeRate}") values ('IDR','${to_currency}','${Number(exchange_rate.toFixed(10))}') returning *`;
        const result = await entityManager.query(sql);

        const inverseSql = `insert into exchange_rate ("${toCurrency}" ,"${fromCurrency}","${exchangeRate}") values ('IDR','${to_currency}','${Number((1 / exchange_rate).toFixed(10))}') returning *`;
        await entityManager.query(inverseSql);
        return result[0];
      });
      return exchange;
    } catch (error) {
      getConstraintError(error);
    }
  }

  async getConvertedExchangeValue(convertExchangeValueDto: ConvertExchangeValueDto) {
    const { to_currency, amount_type, destination_country } = convertExchangeValueDto;
    const exchangeRate = await this.exchangeRepository.findOne({
      where: {
        from_currency: { currency_signature: amount_type === 'foreign' ? to_currency : 'IDR' },
        to_currency: { currency_signature: amount_type === 'foreign' ? 'IDR' : to_currency },
      },
    });
    if (!exchangeRate)
      throw new BadRequestException(`there is no exchange rate from IDR to ${to_currency} or the other way around`);
    const fee = await this.destinationFeeService.getDestinationFee({
      from_country: 'IDR',
      to_country: destination_country,
    });
    return { rate: exchangeRate.exchange_rate, fee };
  }
  async getAmountforTransaction(
    calculateTransactionArgs: CalculateTransactionAmount,
    destination: getDestinationFeeDto,
  ) {
    const { to_country, from_country } = destination;
    const exchangeValue = await this.exchangeRepository.findOne({
      where: {
        from_currency: { currency_signature: 'IDR' },
        to_currency: { currency_signature: calculateTransactionArgs.toCurrency },
      },
    });
    const fee = await this.destinationFeeService.getDestinationFee({ to_country, from_country });
    if (!exchangeValue)
      throw new BadRequestException(
        `There is no exchange rate from IDR to ${calculateTransactionArgs.toCurrency} currency yet`,
      );
    const calculatedValue = exchangeValue.exchange_rate * calculateTransactionArgs.amount + fee;
    const calculateFormattedAmount = Number(calculatedValue.toFixed(2));
    return calculateFormattedAmount;
  }

  async updateExchangeRate(updateExchangeRateDto: UpdateExchangeRateDto) {
    const { exchange_rate, to_currency } = updateExchangeRateDto;
    const updatedRate = await this.exchangeRepository.findOne({
      where: { to_currency: { currency_signature: to_currency } },
    });
    const invertUpdatedRate = await this.exchangeRepository.findOne({
      where: { to_currency: { currency_signature: 'IDR' } },
    });
    if (!updatedRate) throw new BadRequestException(`there is no rate from IDR to ${to_currency} yet `);
    updatedRate.exchange_rate = Number(exchange_rate.toFixed(10));
    invertUpdatedRate.exchange_rate = Number((1 / exchange_rate).toFixed(10));
    await this.exchangeRepository.save([updatedRate, invertUpdatedRate]);
    return updatedRate;
  }
}

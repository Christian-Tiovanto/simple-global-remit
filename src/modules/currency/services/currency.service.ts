import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from '../models/currency.entity';
import { Repository } from 'typeorm';
import { CreateCurrencyDto } from '../dtos/create-currency.dto';
import { DuplicateCurrencyException } from 'src/exceptions/duplicate-currency.exception';
import { ConversionValueQuery } from '../classes/currency.class';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async createCurrency(createCurrencyDto: CreateCurrencyDto) {
    const isCurrency = await this.getCurrency(createCurrencyDto.currency_signature);
    if (isCurrency)
      throw new DuplicateCurrencyException('Duplicate Currency', {
        key: 'currency_signature',

        value: createCurrencyDto.currency_signature,
      });

    const currency = await this.currencyRepository.create(createCurrencyDto);
    await this.currencyRepository.save(currency);
    return currency;
  }

  async getAllCurrency() {
    const currencys = await this.currencyRepository.find();
    return currencys;
  }

  async getConversionValue(currency_signature: string, conversionValueQuery: ConversionValueQuery) {
    const currency = await this.getCurrency(currency_signature);
    if (!currency) throw new BadRequestException('There is no Currency with that signature');

    let convertedValue;
    if (conversionValueQuery.reverse) {
      return (convertedValue = currency.conversion_rate_to_idr * conversionValueQuery.amount);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (convertedValue = conversionValueQuery.amount / currency.conversion_rate_to_idr);
  }

  async getCurrency(currency_signature: string) {
    const currency = await this.currencyRepository.findOne({
      where: { currency_signature: currency_signature },
    });

    return currency;
  }
}

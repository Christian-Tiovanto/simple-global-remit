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
    await this.getCurrencyAndCheckExist(createCurrencyDto.currency_signature, true);
    const currency = await this.currencyRepository.create(createCurrencyDto);
    await this.currencyRepository.save(currency);
    return currency;
  }

  async getAllCurrency() {
    const currencys = await this.currencyRepository.find();
    return currencys;
  }

  async getConversionValue(currency_signature: string, conversionValueQuery: ConversionValueQuery) {
    const currency = await this.getCurrencyAndCheckExist(currency_signature, false);
    let convertedValue;
    if (conversionValueQuery.reverse) {
      return (convertedValue = conversionValueQuery.amount / currency.conversion_rate_to_idr);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (convertedValue = currency.conversion_rate_to_idr * conversionValueQuery.amount);
  }

  private async getCurrencyAndCheckExist(currency_signature: string, createOption: boolean) {
    const currency = await this.currencyRepository.findOne({
      where: { currency_signature: currency_signature },
    });

    if (createOption && currency) {
      throw new DuplicateCurrencyException('Duplicate Currency', {
        key: 'currency_signature',
        value: currency_signature,
      });
    } else if (!currency) {
      throw new BadRequestException('There is no Currency with that signature');
    }
    return currency;
  }
}

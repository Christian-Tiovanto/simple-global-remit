import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from '../models/currency.entity';
import { Repository } from 'typeorm';
import { CreateCurrencyDto } from '../dtos/create-currency.dto';
import { DuplicateCurrencyException } from 'src/exceptions/duplicate-currency.exception';
import { ConversionValueDto } from '../dtos/conversion-value.dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async createCurrency(createCurrencyDto: CreateCurrencyDto) {
    await this.isCurrencyExist(createCurrencyDto.currency_signature, true);
    const currency = await this.currencyRepository.create(createCurrencyDto);
    await this.currencyRepository.save(currency);
    return currency;
  }

  async getAllCurrency() {
    const currencys = await this.currencyRepository.find();
    return currencys;
  }

  async getConversionValue(currency_signature: string, conversionValueDto: ConversionValueDto) {
    const currency = await this.isCurrencyExist(currency_signature, false);
    const convertedValue = currency.conversion_rate_to_idr * conversionValueDto.value;
    return convertedValue;
  }

  private async isCurrencyExist(currency_signature: string, createOption: boolean) {
    const isCurrencyExist = await this.currencyRepository.findOne({
      where: { currency_signature: currency_signature },
    });

    if (createOption && isCurrencyExist)
      throw new DuplicateCurrencyException('Duplicate Currency', {
        key: 'currency_signature',
        value: currency_signature,
      });
    return isCurrencyExist;
  }
}

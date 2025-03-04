import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from '../models/currency.entity';
import { Repository } from 'typeorm';
import { CreateCurrencyDto } from '../dtos/create-currency.dto';
import { DuplicateCurrencyException } from 'src/exceptions/duplicate-currency.exception';

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

  async getCurrency(currency_signature: string) {
    const currency = await this.currencyRepository.findOne({
      where: { currency_signature: currency_signature },
    });

    return currency;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from '../models/exchange-rate.entity';
import { Repository } from 'typeorm';
import { CreateExchangeDto } from '../dtos/create-exchange.dto';

@Injectable()
export class ExchangeRateService {
  constructor(@InjectRepository(ExchangeRate) private exchangeRepository: Repository<ExchangeRate>) {}

  async createExchange(createExchangeDto: CreateExchangeDto) {
    try {
      if (createExchangeDto.fromCurrency === createExchangeDto.toCurrency)
        throw new BadRequestException('cant create Exchange Rate from the same currency');
      const sql = `insert into exchange_rate ("fromCurrencyCode" ,"toCurrencyCode","exchangeRate") values ('${createExchangeDto.fromCurrency}','${createExchangeDto.toCurrency}','${createExchangeDto.exchangerate}') returning *`;
      const result = await this.exchangeRepository.query(sql);
      console.log(result);
      return result[0];
    } catch (error) {
      throw error;
    }
  }
}

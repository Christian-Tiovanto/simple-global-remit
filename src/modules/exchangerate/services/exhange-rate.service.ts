import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from '../models/exchange-rate.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateExchangeDto } from '../dtos/create-exchange.dto';
import { ErrorCode } from 'src/enums/error-code';
import { DuplicateExchangeException } from 'src/exceptions/duplicate-exchange-rate.exception';

@Injectable()
export class ExchangeRateService {
  constructor(@InjectRepository(ExchangeRate) private exchangeRepository: Repository<ExchangeRate>) {}

  async createExchange(createExchangeDto: CreateExchangeDto) {
    try {
      if (createExchangeDto.fromCurrency === createExchangeDto.toCurrency)
        throw new BadRequestException('cant create Exchange Rate from the same currency');
      const sql = `insert into exchange_rate ("fromCurrencyCode" ,"toCurrencyCode","exchangeRate") values ('${createExchangeDto.fromCurrency}','${createExchangeDto.toCurrency}','${createExchangeDto.exchangerate}') returning *`;
      const result = await this.exchangeRepository.query(sql);
      return result[0];
    } catch (error) {
      const regex = /Key \("(\w+)", "(\w+)"\)=\((\w+), (\w+)\)/;
      const errorDetail = error.driverError.detail.match(regex);
      const errorDetailKey = [errorDetail[1], errorDetail[2]];
      const errorDetailVal = [errorDetail[3], errorDetail[4]];
      console.log(errorDetail);
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === ErrorCode.POSTGRES_UNIQUE_VIOLATION_ERROR_CODE
      )
        throw new DuplicateExchangeException('Duplicate Exchange Rate', { value: errorDetailVal, key: errorDetailKey });
      throw error;
    }
  }
}

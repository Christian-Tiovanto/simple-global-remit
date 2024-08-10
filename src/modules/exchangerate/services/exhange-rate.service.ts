import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from '../models/exchange-rate.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateExchangeDto } from '../dtos/create-exchange.dto';
import { ErrorCode } from 'src/enums/error-code';
import { DuplicateExchangeException } from 'src/exceptions/duplicate-exchange-rate.exception';
import { ConvertExchangeValueDto } from '../dtos/get-exchange-value.dto';
import { AccountService } from 'src/modules/account/services/account.service';

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
      const sql = `insert into exchange_rate ("fromCurrencyCode" ,"toCurrencyCode","exchangeRate") values ('${createExchangeDto.fromCurrency}','${createExchangeDto.toCurrency}','${createExchangeDto.exchangerate}') returning *`;
      const result = await this.exchangeRepository.query(sql);
      return result[0];
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === ErrorCode.POSTGRES_UNIQUE_VIOLATION_ERROR_CODE
      )
        this.getDuplicateErrorDetail(error);
      throw error;
    }
  }

  private getDuplicateErrorDetail(error) {
    const regex = /Key \("(\w+)", "(\w+)"\)=\((\w+), (\w+)\)/;
    const errorDetail = error.driverError.detail.match(regex);
    const errorDetailKey = [errorDetail[1], errorDetail[2]];
    const errorDetailVal = [errorDetail[3], errorDetail[4]];
    throw new DuplicateExchangeException('Duplicate Exchange Rate', { value: errorDetailVal, key: errorDetailKey });
  }

  async getUserExchangeTo(toCurr: ConvertExchangeValueDto['toCurrency'], userId: number) {
    const userAccCurr = await this.accountService.getUserAccount(userId);
    const exchangeValue = await this.exchangeRepository.findOne({
      where: {
        fromCurrency: { currency_signature: userAccCurr.currency.currency_signature },
        toCurrency: { currency_signature: toCurr },
      },
    });
    return exchangeValue;
  }

  async getConvertedExchangeValue(convertExchangeValueDto: ConvertExchangeValueDto, userId: number) {
    const exchangeRate = await this.getUserExchangeTo(convertExchangeValueDto.toCurrency, userId);
    const amount = exchangeRate.exchangeRate * convertExchangeValueDto.amount;
    return amount;
  }
}

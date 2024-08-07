import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrencyService } from '../services/currency.service';
import { CreateCurrencyDto } from '../dtos/create-currency.dto';
import { ConversionValueQuery } from '../classes/currency.class';

@Controller('api/v1/currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post()
  async createCurrency(@Body() createCurrencyDto: CreateCurrencyDto) {
    return await this.currencyService.createCurrency(createCurrencyDto);
  }

  @Get()
  async getAllCurrency() {
    return await this.currencyService.getAllCurrency();
  }

  @Get(':signature')
  async getConversionValue(@Param('signature') signature: string, @Query() conversionValueQuery: ConversionValueQuery) {
    return await this.currencyService.getConversionValue(signature, conversionValueQuery);
  }
}

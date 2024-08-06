import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { CurrencyService } from '../services/currency.service';
import { CreateCurrencyDto } from '../dtos/create-currency.dto';
import { ResponseFormatInterceptor } from 'src/interceptors/response-format.interceptor';

@Controller('api/v1/currency')
@UseInterceptors(ResponseFormatInterceptor)
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
}

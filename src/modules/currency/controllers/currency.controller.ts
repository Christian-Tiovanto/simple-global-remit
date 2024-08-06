import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { CurrencyService } from '../services/currency.service';
import { CreateCurrencyDto } from '../dtos/create-currency.dto';
import { ResponseFormatInterceptor } from 'src/interceptors/response-format.interceptor';
import { ConversionValueDto } from '../dtos/conversion-value.dto';

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

  @Get(':signature')
  async getConversionValue(
    @Body() conversionValueDto: ConversionValueDto,
    @Param('signature') signature: string,
  ) {
    console.log('signature');
    console.log(conversionValueDto);
    console.log(signature);
    return await this.currencyService.getConversionValue(signature, conversionValueDto);
  }
}

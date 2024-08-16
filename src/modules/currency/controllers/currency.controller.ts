import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrencyService } from '../services/currency.service';
import { CreateCurrencyDto } from '../dtos/create-currency.dto';
import { ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
import { Currency } from '../models/currency.entity';
import { Auth } from 'src/decorators/auth.decorator';
import { Role } from 'src/enums/user-role';

@ApiTags('currency')
@Controller('api/v1/currency')
@ApiExtraModels(Currency)
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @ApiOperation({ summary: 'Use this API to create a new currency. Roles[admin]' })
  @ApiCreatedResponse({
    description: 'Use this API to create a new currency',
    schema: SwaggerResponseWrapper.createResponse(Currency),
  })
  @Auth(Role.ADMIN)
  @Post()
  async createCurrency(@Body() createCurrencyDto: CreateCurrencyDto) {
    return await this.currencyService.createCurrency(createCurrencyDto);
  }

  @ApiOperation({ summary: 'use this api to get all listed currency.' })
  @ApiOkResponse({
    description: 'use this api to get all listed currency',
    schema: SwaggerResponseWrapper.createResponseList(Currency),
  })
  @Get()
  async getAllCurrency() {
    return await this.currencyService.getAllCurrency();
  }
}

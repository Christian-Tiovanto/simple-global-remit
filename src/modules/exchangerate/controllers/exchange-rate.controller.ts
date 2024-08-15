import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ExchangeRateService } from '../services/exhange-rate.service';
import { CreateExchangeDto } from '../dtos/create-exchange.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ConvertExchangeValueDto } from '../dtos/get-exchange-value.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
import { ExchangeRate } from '../models/exchange-rate.entity';
import { ConvertValueResponse } from '../classes/exchange-rate.class';
import { UpdateExchangeRateDto } from '../dtos/update-exchange-rate.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { Role } from 'src/enums/user-role';

@ApiTags('exchange')
@ApiExtraModels(ExchangeRate)
@ApiBearerAuth()
@Controller('api/v1/rate')
export class ExchangeRateController {
  constructor(private exchangeService: ExchangeRateService) {}

  @ApiCreatedResponse({
    description: 'use this api to create a new Exchange Rate',
    schema: SwaggerResponseWrapper.createResponse(ExchangeRate),
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createExchange(@Body() createExchangeDto: CreateExchangeDto) {
    return await this.exchangeService.createExchange(createExchangeDto);
  }

  @ApiOkResponse({
    description: 'Use this Api to get exchange value',
    type: ConvertValueResponse,
  })
  @ApiQuery({
    description: 'use the query string for defining the currency destination and the total amount',
    name: 'q',
    required: false,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getConvertedExchangeValue(@Query() convertExchangeValueDto: ConvertExchangeValueDto) {
    return await this.exchangeService.getExchangeRate(convertExchangeValueDto);
  }

  // @ApiOkResponse()
  @Auth(Role.ADMIN)
  @Patch('update')
  async updateExchangeRate(@Body() updateExchangeRateDto: UpdateExchangeRateDto) {
    return await this.exchangeService.updateExchangeRate(updateExchangeRateDto);
  }
}

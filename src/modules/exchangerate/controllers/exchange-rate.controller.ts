import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ExchangeRateService } from '../services/exhange-rate.service';
import { CreateExchangeDto } from '../dtos/create-exchange.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ConvertExchangeValueDto } from '../dtos/get-exchange-value.dto';

@Controller('api/v1/rate')
export class ExchangeRateController {
  constructor(private exchangeService: ExchangeRateService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createExchange(@Body() createExchangeDto: CreateExchangeDto) {
    return await this.exchangeService.createExchange(createExchangeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getConvertedExchangeValue(@Request() req, @Query() convertExchangeValueDto: ConvertExchangeValueDto) {
    return await this.exchangeService.getConvertedExchangeValue(convertExchangeValueDto, req.user.id);
  }
}

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ExchangeRateService } from '../services/exhange-rate.service';
import { CreateExchangeDto } from '../dtos/create-exchange.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('api/v1/rate')
export class ExchangeRateController {
  constructor(private exchangeService: ExchangeRateService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createExchange(@Body() createExchangeDto: CreateExchangeDto) {
    return await this.exchangeService.createExchange(createExchangeDto);
  }
}

import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ExchangeRate } from '../models/exchange-rate.entity';

export class ConvertValueResponse {
  @ApiProperty({
    description: 'The data value',
    example: {
      rate: '1000',
      fee: '40000',
    }, // Optional example value
  })
  data: number;
}

export class getAllExchangeRateResponse extends OmitType(ExchangeRate, ['updatedAt', 'createdAt']) {}

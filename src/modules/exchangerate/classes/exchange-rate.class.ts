import { ApiProperty } from '@nestjs/swagger';

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

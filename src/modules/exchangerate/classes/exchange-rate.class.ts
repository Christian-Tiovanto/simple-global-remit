import { ApiProperty } from '@nestjs/swagger';

export class ConvertValueResponse {
  @ApiProperty({
    description: 'The data value',
    example: 100010, // Optional example value
  })
  data: number;
}

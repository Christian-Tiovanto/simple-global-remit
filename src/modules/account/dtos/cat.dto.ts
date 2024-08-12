import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class CatDto {
  @ApiProperty({ example: 'ea' })
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  breed: string;
}

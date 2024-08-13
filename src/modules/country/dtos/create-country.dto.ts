import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ example: 'IDR' })
  @Length(3, 3, { message: 'Country Signature must only contain 3 characters' })
  @IsString({ message: 'country signature must be a string' })
  country_signature: string;

  @ApiProperty({ example: 'Indonesia' })
  @IsString({ message: 'country name must be a string' })
  country_name: string;
}

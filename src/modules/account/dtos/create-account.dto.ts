import { IsNumber, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsNumber()
  accountNumber: number;

  @IsNumber()
  balance: number;

  @IsNumber()
  userId: number;

  @IsString()
  currency: string;
}

import { IsNumber } from 'class-validator';

export class CreateAccountDto {
  @IsNumber()
  accountNumber: number;

  @IsNumber()
  balance: number;

  @IsNumber()
  userId: number;
}

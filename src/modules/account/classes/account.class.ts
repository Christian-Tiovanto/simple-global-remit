import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { Account } from '../models/account.entity';
import { Currency } from 'src/modules/currency/models/currency.entity';

export class AccountCreateResponse extends OmitType(CreateAccountDto, ['currency', 'user_id']) {
  @ApiProperty({ example: { currency_signature: 'USD' } })
  currency: object;

  @ApiProperty({ example: { id: 72 } })
  user: object;

  @ApiProperty({ example: 1 })
  id: number;
}

export class GetAccountResponse extends OmitType(Account, ['currency']) {
  @ApiProperty({ type: Currency })
  currency: object;
}

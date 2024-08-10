import { Account } from 'src/modules/account/models/account.entity';

export interface CalculateTransactionAmount {
  fromCurrency: Account['currency']['currency_signature'];
  toCurrency: Account['currency']['currency_signature'];
  amount: number;
}

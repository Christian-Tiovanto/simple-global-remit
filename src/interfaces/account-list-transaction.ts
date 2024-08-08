import { Account } from 'src/modules/account/models/account.entity';

export interface AccountListTransaction {
  userAccount: Account;
  receiverAccount: Account;
}

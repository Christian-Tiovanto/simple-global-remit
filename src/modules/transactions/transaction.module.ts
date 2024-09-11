import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './models/transactions.entity';
import { TransactionService } from './services/transaction.service';
import { TransactionController } from './controllers/transaction.controller';
import { AccountModule } from '../account/account.module';
import { CurrencyModule } from '../currency/currency.module';
import { ExchangeRateModule } from '../exchangerate/exchangerate.module';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';
import { TransactionLogModule } from '../transaction-log/transaction-log.module';
import { UserNotificationModule } from '../user-notification-token/user-notification.module';
const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = path.extname(file.originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${name}-${randomName}${extension}`);
  },
});
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Transaction]),
    AccountModule,
    CurrencyModule,
    ExchangeRateModule,
    TransactionLogModule,
    MulterModule.register({ storage }),
    UserNotificationModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}

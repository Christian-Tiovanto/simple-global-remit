import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyModule } from './modules/currency/currency.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { DataValidationPipe } from './pipes/validation.pipe';
import { HttpExceptionFilter } from './filters/exception-handler.filter';
import { Currency } from './modules/currency/models/currency.entity';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/models/user.entity';
import { TransactionModule } from './modules/transactions/transaction.module';
import { Transaction } from './modules/transactions/models/transactions.entity';
import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';
import { Account } from './modules/account/models/account.entity';
import { ExchangeRate } from './modules/exchangerate/models/exchange-rate.entity';
import { ExchangeRateModule } from './modules/exchangerate/exchangerate.module';
import { Country } from './modules/country/model/country.entity';
import { CountryModule } from './modules/country/country.module';
import { CountryCurrency } from './modules/country/model/country-currency.entity';
import { DestinationFee } from './modules/destination-fee/model/destination-fee.entity';
import { DestinationFeeModule } from './modules/destination-fee/destination-fee.module';
import { Company } from './modules/company/model/company.entity';
import { CompanyModule } from './modules/company/company.module';
import { TransactionLogModule } from './modules/transaction-log/transaction-log.module';
import { TransactionLog } from './modules/transaction-log/models/transaction-log.entity';
import { UserNotificationModule } from './modules/user-notification-token/user-notification.module';
import { UserNotification } from './modules/user-notification-token/models/user-notification.entity';

@Module({
  providers: [
    { provide: APP_PIPE, useClass: DataValidationPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Currency,
        User,
        Transaction,
        Account,
        ExchangeRate,
        Country,
        CountryCurrency,
        DestinationFee,
        Company,
        TransactionLog,
        UserNotification,
      ],
      synchronize: true,
    }),
    CurrencyModule,
    UserModule,
    TransactionModule,
    AuthModule,
    AccountModule,
    ExchangeRateModule,
    CountryModule,
    DestinationFeeModule,
    CompanyModule,
    TransactionLogModule,
    UserNotificationModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './models/account.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), UserModule],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}

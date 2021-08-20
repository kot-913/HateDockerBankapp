import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/account/accounts.module';
import { UsersModule } from 'src/user/users.module';
import { MonetaryTransactionController } from './monetaryTransaction.controller';
import { MonetaryTransaction } from './monetaryTransaction.entity';
import { MonetaryTransactionService } from './MonetaryTransaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ MonetaryTransaction]),
    AccountsModule,
    UsersModule,
  ],
  controllers: [MonetaryTransactionController],
  providers: [MonetaryTransactionService],
  exports: [MonetaryTransactionService]
})
export class MonetaryTransactionModule {}

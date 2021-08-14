import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UsersController from './users.controller';
import UsersService from './users.service';
import User from './users.entity';
import Account from '../account/accounts.entity';
import { AccountsModule } from '../account/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account]), AccountsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm/repository/Repository';
  import Account from './accounts.entity';
  
  @Injectable()
  export default class AccountsService {
    constructor(
      @InjectRepository(Account)
      private accountsRepository: Repository<Account>
    ) {}
  
    async getAccountByNumber(accountNumber: string) {
      const account = this.accountsRepository.findOne({
        where: { accountNumber }
      });
  
      if (!account) { 
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return account;
    }
  
    async modifyAccountBalance(account: Account, amount: number) {
      try {
        return await this.accountsRepository.save({
          ...account,
          amount
        });
      } catch (e) {
        throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
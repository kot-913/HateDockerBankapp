import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionStatus } from './transactionStatus';
import { CreateTransactionDto } from './dto/create-monetaryTransaction.dto';
import { MonetaryTransaction } from './monetaryTransaction.entity';
import { UpdateTransactionDto } from './dto/update-monetaryTransaction.dto';
import AccountsService from 'src/account/accounts.service';

@Injectable()
export class MonetaryTransactionService {
  constructor(
    @InjectRepository(MonetaryTransaction)
    private transactionsRepository: Repository<MonetaryTransaction>,
    private accountsService: AccountsService
  ) {}

  wait = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));

  async createTransaction(
    initialAccount: string,
    createTransactionDto: CreateTransactionDto,
  ) {
    try {
      const newTransaction = await this.transactionsRepository.save({
        initialAccount,
        status: TransactionStatus.PENDING,
        ...createTransactionDto,
      });
      
      await this.wait(3000);

      const initialAccountState = await this.accountsService.getAccountByNumber(initialAccount);
      const beneficiaryAccountState = await this.accountsService.getAccountByNumber(newTransaction.accountBeneficiary);

      const amountInitialAccount = initialAccountState.amount - newTransaction.amount;
      const amountBeneficiaryAccount = beneficiaryAccountState.amount + newTransaction.amount;
 
      const newInitialAccountState = this.accountsService.onChangeAccountBalance(initialAccountState, amountInitialAccount);
      const newBeneficiaryAccountState = this.accountsService.onChangeAccountBalance(beneficiaryAccountState, amountBeneficiaryAccount);

      const modifiedTransaction = await this.transactionsRepository.preload({
        initialAccount,
        status: TransactionStatus.COMPLETE,
        ...createTransactionDto,
      });

      console.log("newInitialAccountState", newInitialAccountState);
      console.log("newBeneficiaryAccountState", newBeneficiaryAccountState);

      return modifiedTransaction;
      
    } catch (error) {
      console.log(error)
      throw new HttpException(
        'Monetary transaction failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUserTransactions(accountNumber: string): Promise<MonetaryTransaction[]> {
    return await this.transactionsRepository.find({
      where: [
        { initialAccount: accountNumber },
        { accountBeneficiary: accountNumber },
      ],
    });
  }

  async getTransactionById(transactionId: number) {
    let transaction;
    if (!isNaN(transactionId)) {
      transaction = await this.transactionsRepository.findOne(transactionId);
    }
    if (!transaction) {
      throw new NotFoundException('Monetary transaction not found!');
    }
    return transaction;
  }

  async getUserTransaction(accountNumber: string, transactionId: number) {
    const transaction = await this.getTransactionById(transactionId);
    if (
      transaction.initialAccount !== accountNumber &&
      transaction.accountBeneficiary !== accountNumber
    ) {
      throw new NotFoundException('Monetary transaction not found!');
    }
    return transaction;
  }

  async cancelTransaction( 
    id: number,
    updateTransactionDto: UpdateTransactionDto
    ){
    let transactionToCancel = await this.getTransactionById(id);
      try {
       transactionToCancel = await this.transactionsRepository.preload({
            status: TransactionStatus.CANCELED,
            ...updateTransactionDto
        })
          console.log('Transactions is canceled');
          return id;
      } catch (error) {
        throw new HttpException(
          'Monetary transaction failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
}


import {
  HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from './transactionStatus';
import { CreateTransactionDto } from './dto/create-monetaryTransaction.dto';
import { Repository } from 'typeorm';
import { MonetaryTransaction } from './monetaryTransaction.entity';

@Injectable()
export class MonetaryTransactionService {
  constructor(
    @InjectRepository(MonetaryTransaction)
    private transactionsRepository: Repository<MonetaryTransaction>,
  ) {}

  async createTransaction(
    initialAccount: string,
    createTransactionDto: CreateTransactionDto,
  ) {
    try {
      const newTransaction = await this.transactionsRepository.save({
        initialAccount,
        ...createTransactionDto,
      });

      return newTransaction;
    } catch (error) {
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
}
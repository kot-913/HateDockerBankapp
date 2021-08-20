import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
  } from '@nestjs/common';
  import JwtAuthenticationGuard from '../auth/jwt-auth.guard';
  import UserRequest from '../auth/userRequest.interface';
  import { Parser } from 'json2csv';
  import { MonetaryTransactionService } from './MonetaryTransaction.service';
  import { CreateTransactionDto } from './dto/create-monetaryTransaction.dto';
  
  @Controller('transactions')
  export class MonetaryTransactionController {
    constructor(private readonly monetaryTransactionService: MonetaryTransactionService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    createTransaction(
      @Req() request: UserRequest,
      @Body() createTransactionDto: CreateTransactionDto,
    ) {
      const { user } = request;
  
      return this.monetaryTransactionService.createTransaction(
        user.account.accountNumber,
        createTransactionDto,
      );
    }
  
    @Get()
    @UseGuards(JwtAuthenticationGuard)
    getAllUserTransactions(@Req() request: UserRequest) {
      const { user } = request;
      return this.monetaryTransactionService.getAllUserTransactions(
        user.account.accountNumber,
      );
    }
  
    @Get('/download')
    @UseGuards(JwtAuthenticationGuard)
    async downloadCSV(
      @Req() request: UserRequest,
      @Res() response: any,
    ) {
      const { accountNumber } = request.user.account;
      const date = new Date()
      const fileName = `REQUESTED TRANSACTIONS [${date}]`;
      const fields = [
        'id',
        'description',
        'amount',
        'initialAccount',
        'accountBeneficiary',
        'date',
        'status',
      ];
      const transactions = await this.monetaryTransactionService.getAllUserTransactions(
        accountNumber,
      );
  
      const json2csv = new Parser({ fields });
      const csv = json2csv.parse(transactions);
      response.header('Content-Type', 'text/csv');
      response.attachment(fileName);
      return response.send(csv);
    }
  
    @Get('transaction/:transactionId')
    @UseGuards(JwtAuthenticationGuard)
    getTransactionById(@Req() request: UserRequest) {
      const { user, params } = request;
  
      return this.monetaryTransactionService.getUserTransaction(
        user.account.accountNumber,
        Number(params.transactionId),
      );
    }
  }
  
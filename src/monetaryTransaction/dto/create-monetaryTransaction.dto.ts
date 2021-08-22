import { TransactionStatus } from "../transactionStatus";

export class CreateTransactionDto {
  id: number;
  amount: number;
  description: string;
  accountBeneficiary: string;
  initialAccount: string;
  date: Date;
  status: TransactionStatus;
}

import { TransactionStatus } from '../TransactionStatus';

export class UpdateTransactionDto {
  amount?: number;
  description?: string;
  accountBeneficiary?: string;
  transactionId?: string;
  status?: TransactionStatus;
}
import { TransactionStatus } from './transactionStatus';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class MonetaryTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'No description' })
  description?: string;

  @Column()
  amount: number;

  @Column()
  initialAccount: string;

  @Column()
  accountBeneficiary: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date?: Date;

  @Column({ default: TransactionStatus.CREATED })
  status?: TransactionStatus;
}
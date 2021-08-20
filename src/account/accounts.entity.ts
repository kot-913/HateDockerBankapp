import User from '../user/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity('accounts')
export default class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountNumber: string;

  @Column({ type: 'decimal', default: 168.5 })
  amount: number;

  @OneToOne(() => User)
  user: User;
}
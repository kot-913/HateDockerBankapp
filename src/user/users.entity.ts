import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import Account from '../account/accounts.entity';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  dateOfBirth: Date;

  @Column({ nullable: true })
  avatar: string;

  // @OneToOne(() => Account, { eager: true, cascade: true })
  // @JoinColumn()
  // account: string;
}
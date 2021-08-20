import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreateUserDto from './dto/create-user.dto';
import User from './users.entity';
import { hash } from 'bcrypt';
import Account from '../account/accounts.entity';
import UpdateUserDto from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
 
@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}
  
  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }
 
  async getUserById(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  getRandomAccountNumber(max: number, min: number){
    let accountNumber = '';
    for (let i=0; i<4; i++){
  accountNumber += `${Math.floor(Math.random() * (max-min) + min)} `;
}
  return accountNumber; 
  }

  async createUser(user: CreateUserDto) {
    try{    
      const account = this.accountsRepository.create({
       accountNumber: this.getRandomAccountNumber( 9999, 1000 ),
      });
      const hashedPassword = await hash(user.password, 10)
      const newUser = this.usersRepository.create({
        ...user,
        account,
        password: hashedPassword,
      })  
      await this.usersRepository.save(newUser);
      return newUser;
     } catch (error){
       console.log(error);
     }
  }
  
async deleteUser(id: number) {
    const userToRemove = await this.getUserById(id);
    await this.usersRepository.remove(userToRemove);
    return id;
  }

async modifyUser(id: number, updateUserDto: UpdateUserDto) {
  const userToModify = await this.usersRepository.preload({
    id: Number(id),
    ...updateUserDto,
  });
  if (!userToModify) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
  await this.usersRepository.save(userToModify);
  return userToModify;
}

public async setAvatar(id: number, avatar: string){
 await this.modifyUser(id, {avatar});
 return avatar;
} 
}
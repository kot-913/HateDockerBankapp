import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreateUserDto from './dto/create-user.dto';
import User from './users.entity';
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

  // getRandomIntInclusive(min: number, max: number) {
  //   const randomBuffer = new Uint32Array(1);
  //   window.crypto.getRandomValues(randomBuffer);
  //   let randomNumber = randomBuffer[0] / (0xffffffff + 1);
  //   min = Math.ceil(min);
  //   max = Math.floor(max);
  //   return Math.floor(randomNumber * (max - min + 1)) + min;
  // }
  async createUser(user: CreateUserDto) {
    try{    
      const newAccount = this.accountsRepository.create({
      //  account: this.getRandomIntInclusive(10, 100),
      });
      const newUser = this.usersRepository.create({
        ...user,
        // newAccount,
      })  
      await this.usersRepository.save(user);
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
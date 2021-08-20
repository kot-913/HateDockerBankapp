import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UsersService from "../user/users.service";
import CreateUserDto from '../user/dto/create-user.dto';
import { TokenPayload } from './tokenPayload.interface';

@Injectable()
export class AuthenticationService {
    constructor(
      private readonly usersService: UsersService,
      private readonly jwtService: JwtService,
    ) {}
   
    public async register(registrationData: CreateUserDto) {
      try {
        const createdUser = await this.usersService.createUser(registrationData);
        createdUser.password = undefined;
        return createdUser;
      } catch (error) {
        console.log(error);
        throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    public async getAuthenticatedUser(email: string, hashedPassword: string) {
      try {
        const user = await this.usersService.getUserByEmail(email);
        const isPasswordMatching = await bcrypt.compare(
          hashedPassword,
          user.password
        );
        if (!isPasswordMatching) {
          throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
        user.password = undefined;
        return user;
      } catch (error) {
        throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
      }
    }

    public getCookieWithJwtToken(userId: number) {
      const payload: TokenPayload = { userId };
      const token = this.jwtService.sign(payload);
      return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`;
    }

    public getCookieForLogOut() {
      return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }
  }
  
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import UsersService from '../user/users.service';
import { TokenPayload } from './tokenPayload.interface';
 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Authentication;
      }]),
      secretOrKey: process.env.JWT_SECRET
    });
  }
 
  async validate(payload: TokenPayload) {
    return this.userService.getUserById(payload.userId);
  }
}
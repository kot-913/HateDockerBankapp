import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './auth.service';
import CreateUserDto from '../user/dto/create-user.dto';
import UserRequest from './userRequest.interface';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import JwtAuthenticationGuard from './jwt-auth.guard';
 
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {}
 
  @Post('register')
  async register(@Body() registrationData: CreateUserDto) {
    return this.authenticationService.register(registrationData);
  }
 
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: UserRequest, @Res() response: Response) {
    const {user} = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(cookie);
  }
  
  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: UserRequest, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: UserRequest) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
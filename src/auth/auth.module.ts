import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './auth.service';
import { AuthenticationController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../user/users.module';
 
@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: `${process.env.JWT_EXPIRATION_TIME}s`,
        },
      }),
    }),
  ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
  controllers: [AuthenticationController],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}

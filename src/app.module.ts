import { AccountsModule } from './account/accounts.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';
import { MonetaryTransactionModule } from './monetaryTransaction/monetaryTransaction.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthenticationModule,
    MonetaryTransactionModule,
    AccountsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { TransactionModule } from './domain/transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth-module';
import { AccountModule } from './domain/account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AccountModule,
    TransactionModule,
    AuthModule,
  ],
})
export class AppModule {}

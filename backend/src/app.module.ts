import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { TransactionModule } from './domain/transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth-module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TransactionModule,
    AuthModule,
  ],
})
export class AppModule {}

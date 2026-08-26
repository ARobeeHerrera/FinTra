import { Module } from '@nestjs/common';
import { TransactionController } from '../../domain/transaction/presentation/transaction.controller';
import { CreateTransactionUseCase } from '../transaction/useCases/create-transaction.use-case';
import { TRANSACTION_REPOSITORY } from '../transaction/repository/transaction.repository';
import { PrismaTransactionRepository } from '../transaction/infrastructure/mapper/repository/prisma.transaction.repository';
import { PrismaService } from '../../shared/infrastructure/prisma/prisma.service';
import { FindTransactionByIdUseCase } from './useCases/find-transaction-by-id.use-case';

@Module({
  controllers: [TransactionController],
  providers: [
    PrismaService,
    CreateTransactionUseCase,
    FindTransactionByIdUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
  ],
})
export class TransactionModule {}

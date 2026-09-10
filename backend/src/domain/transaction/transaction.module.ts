import { Module } from '@nestjs/common';
import { TransactionController } from '../../domain/transaction/presentation/transaction.controller';
import { CreateTransactionUseCase } from '../transaction/useCases/create-transaction.use-case';
import { TRANSACTION_REPOSITORY } from '../transaction/repository/transaction.repository';
import { PrismaTransactionRepository } from '../transaction/infrastructure/mapper/repository/prisma.transaction.repository';
import { PrismaService } from '../../shared/infrastructure/prisma/prisma.service';
import { FindTransactionByIdUseCase } from './useCases/find-transaction-by-id.use-case';
import { UpdateTransactionUseCase } from './useCases/update-transaction.use-case';
import { FindTransactionByAccountIdUseCase } from './useCases/find-transaction-by-account-id.use-case';
import { DeleteTransactionUseCase } from './useCases/delete-transaction.use-case';

@Module({
  controllers: [TransactionController],
  providers: [
    PrismaService,
    CreateTransactionUseCase,
    FindTransactionByIdUseCase,
    UpdateTransactionUseCase,
    FindTransactionByAccountIdUseCase,
    DeleteTransactionUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
  ],
  exports: [TRANSACTION_REPOSITORY],
})
export class TransactionModule {}

import { PrismaService } from '../../shared/infrastructure/prisma/prisma.service';
import { ACCOUNT_REPOSITORY } from './repository/account.repository';
import { AccountController } from './presentation/account.controller';
import { PrismaAccountRepository } from './infrastructure/mapper/repository/prisma.account.repository';
import { Module } from '@nestjs/common';
import { CreateAccountUseCase } from './useCase/create-account.use-case';
import { DeleteAccountUseCase } from './useCase/delete-account.use-case';
import { FindAccountByUserIdUseCase } from './useCase/find-account-by-user-id.use-case';
import { UpdateAccountUseCase } from './useCase/update-account.use-case';
import { GetAccountBalanceUseCase } from './useCase/get-account-balance.use-case';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  controllers: [AccountController],
  providers: [
    PrismaService,
    CreateAccountUseCase,
    FindAccountByUserIdUseCase,
    UpdateAccountUseCase,
    DeleteAccountUseCase,
    GetAccountBalanceUseCase,
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: PrismaAccountRepository,
    },
  ],
  imports: [TransactionModule],
})
export class AccountModule {}

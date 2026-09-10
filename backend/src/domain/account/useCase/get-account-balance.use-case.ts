import { Inject, NotFoundException } from '@nestjs/common';
import {
  TRANSACTION_REPOSITORY,
  ITransactionRepository,
} from '../../../domain/transaction/repository/transaction.repository';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from '../repository/account.repository';

export class GetAccountBalanceUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(userId: string): Promise<number> {
    const account = await this.accountRepository.findByUserId(userId);

    if (!account) {
      throw new NotFoundException('Account does not exist');
    }

    const transactions = await this.transactionRepository.findByAccountId(
      account.getId(),
    );

    const accountBalance = transactions.reduce((total, transaction) => {
      if (transaction.getType() === 'INCOME') {
        return total + transaction.getAmount();
      } else {
        return total - transaction.getAmount();
      }
    }, 0);

    return accountBalance;
  }
}

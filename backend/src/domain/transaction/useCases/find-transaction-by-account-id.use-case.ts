import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../repository/transaction.repository';
import { Transaction } from '../domain/entity/transaction.entity';

export class FindTransactionByAccountIdUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(accountId: string, userId: string): Promise<Transaction[]> {
    const transactionRepository =
      await this.transactionRepository.findByAccountId(accountId);

    if (transactionRepository.length === 0) {
      throw new NotFoundException('Transaction does not exist in this account');
    }

    const belongToUser = transactionRepository.every(
      (transaction) => transaction.getUserId() === userId,
    );

    if (!belongToUser) {
      throw new ForbiddenException('This account does not belong to this user');
    }

    return transactionRepository;
  }
}

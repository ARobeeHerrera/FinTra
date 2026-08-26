import { randomUUID } from 'crypto';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../repository/transaction.repository';
import { Transaction } from '../domain/entity/transaction.entity';
import { Inject } from '@nestjs/common';

export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    accountId: string,
    userId: string,
    amount: number,
    type: 'INCOME' | 'EXPENSE',
    categoryId: string,
    description: string,
    date: Date,
  ): Promise<Transaction> {
    const transaction = Transaction.create({
      id: randomUUID(),
      userId,
      accountId,
      amount,
      type,
      categoryId,
      description,
      date,
    });

    await this.transactionRepository.save(transaction);
    return transaction;
  }
}

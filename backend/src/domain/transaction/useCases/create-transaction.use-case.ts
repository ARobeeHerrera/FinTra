import { randomUUID } from 'crypto';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../repository/transaction.repository';
import { Transaction } from '../domain/entity/transaction.entity';
import { Inject } from '@nestjs/common';

export type CreateTransactionUseCaseParams = {
  accountId: string;
  userId: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId: string;
  description: string;
  date: Date;
};

export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(params: CreateTransactionUseCaseParams): Promise<Transaction> {
    const transaction = Transaction.create({
      id: randomUUID(),
      accountId: params.accountId,
      userId: params.userId,
      amount: params.amount,
      type: params.type,
      categoryId: params.categoryId,
      description: params.description,
      date: params.date,
    });

    await this.transactionRepository.save(transaction);
    return transaction;
  }
}

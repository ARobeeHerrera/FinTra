import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../repository/transaction.repository';
import { Transaction } from '../domain/entity/transaction.entity';

export class FindTransactionByIdUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(id: string, userId: string): Promise<Transaction> {
    const repository = await this.transactionRepository.findById(id);

    if (!repository) {
      throw new NotFoundException(`Transaction with ${id} not found`);
    }

    if (userId !== repository.getUserId()) {
      throw new ForbiddenException(
        'This Transaction does not belong to this user',
      );
    }
    return repository;
  }
}

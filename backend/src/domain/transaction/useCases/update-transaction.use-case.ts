import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import {
  Transaction,
  TransactionType,
} from '../domain/entity/transaction.entity';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../repository/transaction.repository';

export type UpdateTransactionUseCaseParams = {
  id: string;
  userId: string;
  amount?: number;
  description?: string;
  categoryId?: string;
  type?: TransactionType;
};

export class UpdateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    updateTransactionUseCaseParams: UpdateTransactionUseCaseParams,
  ): Promise<Transaction> {
    const existingTransaction = await this.transactionRepository.findById(
      updateTransactionUseCaseParams.id,
    );

    if (!existingTransaction) {
      throw new NotFoundException('No transaction found');
    }

    if (
      existingTransaction.getUserId() !== updateTransactionUseCaseParams.userId
    ) {
      throw new ForbiddenException(
        'This transaction does not belong to this user',
      );
    }

    if (updateTransactionUseCaseParams.amount !== undefined) {
      existingTransaction.updateAmount(updateTransactionUseCaseParams.amount);
    }

    if (updateTransactionUseCaseParams.categoryId !== undefined) {
      existingTransaction.updateCategoryId(
        updateTransactionUseCaseParams.categoryId,
      );
    }

    if (updateTransactionUseCaseParams.description !== undefined) {
      existingTransaction.updateDescription(
        updateTransactionUseCaseParams.description,
      );
    }

    if (updateTransactionUseCaseParams.type !== undefined) {
      existingTransaction.updateType(updateTransactionUseCaseParams.type);
    }

    await this.transactionRepository.save(existingTransaction);
    return existingTransaction;
  }
}

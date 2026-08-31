import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../repository/transaction.repository';

type DeleteTransactionParams = {
  id: string;
  userId: string;
};

export class DeleteTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(params: DeleteTransactionParams): Promise<void> {
    const existingTransaction = await this.transactionRepository.findById(
      params.id,
    );

    if (!existingTransaction) {
      throw new NotFoundException(`Transaction with ${params.id} not found`);
    }

    if (existingTransaction.getUserId() !== params.userId) {
      throw new ForbiddenException(
        'This transaction does not belong to this user',
      );
    }

    await this.transactionRepository.delete(params.id);
  }
}

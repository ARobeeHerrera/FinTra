import {
  ConflictException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../../domain/transaction/repository/transaction.repository';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from '../repository/account.repository';

type DeleteAccountParams = {
  id: string;
  userId: string;
};

export class DeleteAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(params: DeleteAccountParams): Promise<void> {
    const existingAccount = await this.accountRepository.findById(params.id);

    if (!existingAccount) {
      throw new NotFoundException('Account does not exist');
    }

    if (existingAccount.getUserId() !== params.userId) {
      throw new ForbiddenException('This account does not belong to user');
    }

    const existingTransaction =
      await this.transactionRepository.findByAccountId(existingAccount.getId());

    if (existingTransaction.length !== 0) {
      throw new ConflictException(
        'Cannot delete account with existing transactions',
      );
    }

    await this.accountRepository.delete(params.id);
  }
}

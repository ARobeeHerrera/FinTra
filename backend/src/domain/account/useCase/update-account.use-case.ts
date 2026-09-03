import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from '../repository/account.repository';
import { Account, CurrencyType } from '../domain/entity/account.entity';

export type UpdateAccountParams = {
  id: string;
  userId: string;
  name?: string;
  currency?: CurrencyType;
};

export class UpdateAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
  ) {}

  async execute(updateParams: UpdateAccountParams): Promise<Account> {
    const existingAccount = await this.accountRepository.findById(
      updateParams.id,
    );

    if (!existingAccount) {
      throw new NotFoundException('Account does not exist');
    }

    if (existingAccount.getUserId() !== updateParams.userId) {
      throw new ForbiddenException('This account does not belong to user');
    }

    if (updateParams.name !== undefined) {
      existingAccount.updateName(updateParams.name);
    }

    if (updateParams.currency !== undefined) {
      existingAccount.updateCurrency(updateParams.currency);
    }

    await this.accountRepository.save(existingAccount);
    return existingAccount;
  }
}

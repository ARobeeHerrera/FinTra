import { Inject, NotFoundException } from '@nestjs/common';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from '../repository/account.repository';
import { Account } from '../domain/entity/account.entity';

export class FindAccountByUserIdUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
  ) {}

  async execute(userId: string): Promise<Account> {
    const existingAccount = await this.accountRepository.findByUserId(userId);

    if (!existingAccount) {
      throw new NotFoundException(`Account with User ID ${userId} not found`);
    }

    return existingAccount;
  }
}

import { ConflictException, Inject } from '@nestjs/common';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from '../repository/account.repository';
import { Account, CurrencyType } from '../domain/entity/account.entity';
import { randomUUID } from 'crypto';

type CreateAccountParams = {
  userId: string;
  name: string;
  currency: CurrencyType;
};

export class CreateAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
  ) {}

  async execute(params: CreateAccountParams): Promise<Account> {
    const existingAccount = await this.accountRepository.findByUserId(
      params.userId,
    );

    if (existingAccount) {
      throw new ConflictException('User already has an account');
    }

    const account = Account.create({
      id: randomUUID(),
      userId: params.userId,
      name: params.name,
      currency: params.currency,
    });

    await this.accountRepository.save(account);
    return account;
  }
}

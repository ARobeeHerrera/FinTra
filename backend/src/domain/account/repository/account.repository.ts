import { Account } from '../domain/entity/account.entity';

export const ACCOUNT_REPOSITORY = Symbol('IAccountRepository');

export interface IAccountRepository {
  save(account: Account): Promise<void>;
  findById(id: string): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account | null>;
  delete(id: string): Promise<void>;
}

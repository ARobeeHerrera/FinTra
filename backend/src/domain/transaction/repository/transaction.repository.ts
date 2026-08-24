import { Transaction } from '../domain/entity/transaction.entity';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
  delete(id: string): Promise<void>;
}

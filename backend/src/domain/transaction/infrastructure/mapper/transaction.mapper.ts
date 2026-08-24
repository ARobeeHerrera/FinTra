import { Transaction as PrismaTransaction } from '../../../../../prisma/generated/client';
import { Transaction } from '../../domain/entity/transaction.entity';

export class TransactionMapper {
  static toDomain(raw: PrismaTransaction): Transaction {
    return Transaction.create({
      id: raw.id,
      accountId: raw.accountId,
      amount: raw.amount,
      type: raw.type,
      categoryId: raw.categoryId,
      description: raw.description,
      date: raw.date,
    });
  }

  static toPersistence(
    transaction: Transaction,
  ): Omit<PrismaTransaction, 'createdAt' | 'updatedAt'> {
    return {
      id: transaction.getId(),
      accountId: transaction.getAccountId(),
      amount: transaction.getAmount(),
      type: transaction.getType(),
      categoryId: transaction.getCategoryId(),
      description: transaction.getDescription(),
      date: transaction.getDate(),
    };
  }
}

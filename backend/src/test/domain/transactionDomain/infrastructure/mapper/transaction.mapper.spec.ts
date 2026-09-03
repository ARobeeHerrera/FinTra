import { Transaction as PrismaTransaction } from '../../../../../../prisma/generated/client';
import { TransactionMapper } from '../../../../../domain/transaction/infrastructure/mapper/transaction.mapper';
import { Transaction } from '../../../../../domain/transaction/domain/entity/transaction.entity';

describe('Transaction Mapper', () => {
  it('should map a raw PrismaTransaction to a valid DomainTransaction', () => {
    const raw = {
      id: '12345',
      accountId: '67890',
      userId: '67890',
      amount: 100.0,
      type: 'EXPENSE' as PrismaTransaction['type'],
      categoryId: '2',
      description: 'Dinner',
      date: new Date('2026-08-04'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const domainTransaction = TransactionMapper.toDomain(raw);

    expect(domainTransaction).toBeInstanceOf(Transaction);
    expect(domainTransaction.getId()).toBe(raw.id);
    expect(domainTransaction.getAccountId()).toBe(raw.accountId);
    expect(domainTransaction.getAmount()).toBe(raw.amount);
    expect(domainTransaction.getType()).toBe(raw.type);
    expect(domainTransaction.getCategoryId()).toBe(raw.categoryId);
    expect(domainTransaction.getDescription()).toBe(raw.description);
    expect(domainTransaction.getDate()).toEqual(raw.date);
    expect(domainTransaction.getUserId()).toEqual(raw.userId);
  });

  it('should map a valid PrismaTransaction to a valid DomainTransaction', () => {
    const raw = {
      id: '12345',
      accountId: '67890',
      userId: '67890',
      amount: 0,
      type: 'EXPENSE' as PrismaTransaction['type'],
      categoryId: '2',
      description: 'Dinner',
      date: new Date('2026-08-04'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(() => TransactionMapper.toDomain(raw)).toThrow(
      'Amount must be a positive number',
    );
  });

  it('should map a valid DomainTransaction to a valid PrismaTransaction', () => {
    const raw = Transaction.create({
      id: '12345',
      accountId: '67890',
      userId: '67890',
      amount: 100,
      type: 'EXPENSE',
      categoryId: '2',
      description: 'Dinner',
      date: new Date('2026-08-04'),
    });

    const prismaTransaction = TransactionMapper.toPersistence(raw);

    expect(prismaTransaction).toEqual({
      id: raw.getId(),
      accountId: raw.getAccountId(),
      userId: raw.getUserId(),
      amount: raw.getAmount(),
      type: raw.getType(),
      categoryId: raw.getCategoryId(),
      description: raw.getDescription(),
      date: raw.getDate(),
    });
  });
});

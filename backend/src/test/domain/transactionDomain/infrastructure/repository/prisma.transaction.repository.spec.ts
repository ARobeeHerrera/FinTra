/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Transaction } from '../../../../../domain/transaction/domain/entity/transaction.entity';
import { PrismaTransactionRepository } from '../../../../../domain/transaction/infrastructure/mapper/repository/prisma.transaction.repository';

describe('Prisma Transaction Repository', () => {
  let repository: PrismaTransactionRepository;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      transaction: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
    };
    repository = new PrismaTransactionRepository(prismaMock);
  });

  it('should save a transaction', async () => {
    const transaction = Transaction.create({
      id: '12345',
      accountId: '123415',
      userId: '123415',
      amount: 100,
      type: 'EXPENSE',
      categoryId: '2',
      description: 'Dinner',
      date: new Date('2026-08-04'),
    });

    await repository.save(transaction);

    expect(prismaMock.transaction.upsert).toHaveBeenCalledWith({
      where: { id: transaction.getId() },
      create: {
        id: transaction.getId(),
        accountId: transaction.getAccountId(),
        userId: transaction.getUserId(),
        amount: transaction.getAmount(),
        type: transaction.getType(),
        categoryId: transaction.getCategoryId(),
        description: transaction.getDescription(),
        date: transaction.getDate(),
      },
      update: {
        id: transaction.getId(),
        accountId: transaction.getAccountId(),
        userId: transaction.getUserId(),
        amount: transaction.getAmount(),
        type: transaction.getType(),
        categoryId: transaction.getCategoryId(),
        description: transaction.getDescription(),
        date: transaction.getDate(),
      },
    });
  });

  it('should return a domain Transaction when id is valid', async () => {
    prismaMock.transaction.findUnique.mockResolvedValue({
      id: '12345',
      accountId: '0981234',
      userId: 'test-user-id',
      amount: 100,
      type: 'EXPENSE',
      categoryId: '2',
      description: 'Food',
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await repository.findById('12345');
    expect(prismaMock.transaction.findUnique).toHaveBeenCalledWith({
      where: { id: '12345' },
    });

    expect(result).toBeInstanceOf(Transaction);
    expect(result?.getId()).toBe('12345');
    expect(result?.getAccountId()).toBe('0981234');
    expect(result?.getUserId()).toBe('test-user-id');
    expect(result?.getAmount()).toBe(100);
    expect(result?.getType()).toBe('EXPENSE');
    expect(result?.getCategoryId()).toBe('2');
    expect(result?.getDescription()).toBe('Food');
  });

  it('should return a null when no row is found', async () => {
    prismaMock.transaction.findUnique.mockResolvedValue(null);

    const result = await repository.findById('nonexisitng-id');

    expect(result).toBeNull();
  });

  it('should return an array of Domain Transactions', async () => {
    prismaMock.transaction.findMany.mockResolvedValue([
      {
        id: '1',
        accountId: '0981234',
        userId: 'test-user-id',
        amount: 100,
        type: 'EXPENSE',
        categoryId: '2',
        description: 'Food',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        accountId: '0981234',
        userId: 'test-user-id',
        amount: 200,
        type: 'INCOME',
        categoryId: '1',
        description: 'Allowance',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await repository.findByAccountId('0981234');

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Transaction);
    expect(result[0].getId()).toBe('1');
    expect(result[1]).toBeInstanceOf(Transaction);
    expect(result[1].getId()).toBe('2');
  });

  it('should call prisma.transaction.delete with the correct id', async () => {
    await repository.delete('12345');

    expect(prismaMock.transaction.delete).toHaveBeenCalledWith({
      where: { id: '12345' },
    });
  });
});

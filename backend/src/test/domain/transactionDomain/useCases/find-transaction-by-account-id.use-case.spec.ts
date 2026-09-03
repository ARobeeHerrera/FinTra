import { FindTransactionByAccountIdUseCase } from '../../../../domain/transaction/useCases/find-transaction-by-account-id.use-case';
import { ITransactionRepository } from '../../../../domain/transaction/repository/transaction.repository';
import { Transaction } from '../../../../domain/transaction/domain/entity/transaction.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('FindTransactionByAccountId', () => {
  let repository: jest.Mocked<ITransactionRepository>;
  let findTransactionByAccountIdUseCase: FindTransactionByAccountIdUseCase;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByAccountId: jest.fn(),
      delete: jest.fn(),
    };

    findTransactionByAccountIdUseCase = new FindTransactionByAccountIdUseCase(
      repository,
    );
  });

  it('should return transactions belong to account id ', async () => {
    const transaction = [
      Transaction.create({
        id: 'test-id-1',
        accountId: 'test-account-id',
        userId: 'test-user-id',
        amount: 300,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Breakfast',
        date: new Date(),
      }),
      Transaction.create({
        id: 'test-id-2',
        accountId: 'test-account-id',
        userId: 'test-user-id',
        amount: 400,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
      Transaction.create({
        id: 'test-id-3',
        accountId: 'test-account-id',
        userId: 'test-user-id',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Dinner',
        date: new Date(),
      }),
      Transaction.create({
        id: 'test-id-4',
        accountId: 'test-account-id',
        userId: 'test-user-id',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Dinner',
        date: new Date(),
      }),
    ];

    repository.findByAccountId.mockResolvedValue(transaction);

    const transactions = await findTransactionByAccountIdUseCase.execute(
      'test-account-id',
      'test-user-id',
    );

    expect(transactions.length).toBe(4);
    expect(transactions[0].getAccountId()).toBe('test-account-id');
    expect(transactions[1].getAccountId()).toBe('test-account-id');
    expect(transactions[2].getAccountId()).toBe('test-account-id');
    expect(transactions[3].getAccountId()).toBe('test-account-id');
    expect(repository.findByAccountId.mock.calls.length).toBeGreaterThan(0);
    expect(repository.findByAccountId.mock.calls[0][0]).toBe('test-account-id');
  });

  it('should throw an error when transaction does not exist in the given account', async () => {
    repository.findByAccountId.mockResolvedValue([]);

    await expect(
      findTransactionByAccountIdUseCase.execute(
        'non-existing-account-id',
        'non-existing-user-id',
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw an error when account does not belong to user', async () => {
    const transactions = [
      Transaction.create({
        id: 'test-id-1',
        accountId: 'test-account-id',
        userId: 'test-user-id',
        amount: 300,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Breakfast',
        date: new Date(),
      }),
    ];

    repository.findByAccountId.mockResolvedValue(transactions);

    await expect(
      findTransactionByAccountIdUseCase.execute(
        'test-account-id',
        'non-existing-user-id',
      ),
    ).rejects.toThrow(ForbiddenException);
  });
});

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Transaction } from '../../../domain/transaction/domain/entity/transaction.entity';
import { ITransactionRepository } from '../../../domain/transaction/repository/transaction.repository';
import { UpdateTransactionUseCase } from '../../../domain/transaction/useCases/update-transaction.use-case';

describe('UpdateTransactionUseCase', () => {
  let repository: jest.Mocked<ITransactionRepository>;
  let updateTransactionUseCase: UpdateTransactionUseCase;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByAccountId: jest.fn(),
      delete: jest.fn(),
    };

    updateTransactionUseCase = new UpdateTransactionUseCase(repository);
  });

  it('should update the transaction when all parameters are valid', async () => {
    const transaction = Transaction.create({
      id: 'test-id',
      accountId: 'test-account-id',
      userId: 'test-user-id',
      amount: 500,
      type: 'EXPENSE',
      categoryId: '1',
      description: 'Lunch',
      date: new Date(),
    });
    repository.findById.mockResolvedValue(transaction);

    await updateTransactionUseCase.execute({
      id: 'test-id',
      userId: 'test-user-id',
      amount: 200,
      type: 'INCOME',
      categoryId: '2',
      description: 'Salary',
    });

    const savedTransaction = repository.save.mock.calls[0][0];

    expect(repository.save.mock.calls.length).toBeGreaterThan(0);
    expect(savedTransaction.getAmount()).not.toBe(500);
    expect(savedTransaction.getAmount()).toBe(200);
    expect(savedTransaction.getDescription()).toBe('Salary');
    expect(savedTransaction.getCategoryId()).toBe('2');
    expect(savedTransaction.getType()).toBe('INCOME');
  });

  it('should throw an error when id does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      updateTransactionUseCase.execute({
        id: 'non-existing-id',
        userId: 'non-existing-user-id',
        amount: 400,
      }),
    ).rejects.toThrow(NotFoundException);
    expect(repository.save.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should throw an error when transaction does not belong to user', async () => {
    const transaction = Transaction.create({
      id: 'test-id',
      accountId: 'test-account-id',
      userId: 'test-user-id',
      amount: 500,
      type: 'EXPENSE',
      categoryId: '1',
      description: 'Lunch',
      date: new Date(),
    });
    repository.findById.mockResolvedValue(transaction);

    await expect(
      updateTransactionUseCase.execute({
        id: 'test-id',
        userId: 'does-not-belong-to-user',
        amount: 200,
      }),
    ).rejects.toThrow(ForbiddenException);
    expect(repository.save.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should throw an error when amount is equal to 0', async () => {
    const transaction = Transaction.create({
      id: 'test-id',
      accountId: 'test-account-id',
      userId: 'test-user-id',
      amount: 500,
      type: 'EXPENSE',
      categoryId: '1',
      description: 'Lunch',
      date: new Date(),
    });
    repository.findById.mockResolvedValue(transaction);

    await expect(
      updateTransactionUseCase.execute({
        id: 'test-id',
        userId: 'test-user-id',
        amount: 0,
      }),
    ).rejects.toThrow('Amount must be a positive number');
    expect(repository.save.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should throw an error when amount is a negative number', async () => {
    const transaction = Transaction.create({
      id: 'test-id',
      accountId: 'test-account-id',
      userId: 'test-user-id',
      amount: 500,
      type: 'EXPENSE',
      categoryId: '1',
      description: 'Lunch',
      date: new Date(),
    });
    repository.findById.mockResolvedValue(transaction);

    await expect(
      updateTransactionUseCase.execute({
        id: 'test-id',
        userId: 'test-user-id',
        amount: -500,
      }),
    ).rejects.toThrow('Amount must be a positive number');
    expect(repository.save.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should succeed even without update parameter but does not update any property', async () => {
    const transaction = Transaction.create({
      id: 'test-id',
      accountId: 'test-account-id',
      userId: 'test-user-id',
      amount: 500,
      type: 'EXPENSE',
      categoryId: '1',
      description: 'Lunch',
      date: new Date(),
    });
    repository.findById.mockResolvedValue(transaction);

    await updateTransactionUseCase.execute({
      id: 'test-id',
      userId: 'test-user-id',
    });

    const savedTransaction = repository.save.mock.calls[0][0];

    expect(repository.save.mock.calls.length).toBeGreaterThan(0);
    expect(savedTransaction.getAmount()).toBe(500);
    expect(savedTransaction.getType()).toBe('EXPENSE');
    expect(savedTransaction.getCategoryId()).toBe('1');
    expect(savedTransaction.getDescription()).toBe('Lunch');
  });
});

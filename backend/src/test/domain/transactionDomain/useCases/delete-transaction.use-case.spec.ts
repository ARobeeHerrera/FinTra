import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Transaction } from '../../../../domain/transaction/domain/entity/transaction.entity';
import { ITransactionRepository } from '../../../../domain/transaction/repository/transaction.repository';
import { DeleteTransactionUseCase } from '../../../../domain/transaction/useCases/delete-transaction.use-case';

describe('DeleteTransactionUseCase', () => {
  let repository: jest.Mocked<ITransactionRepository>;
  let deleteTransactionUseCase: DeleteTransactionUseCase;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByAccountId: jest.fn(),
      delete: jest.fn(),
    };

    deleteTransactionUseCase = new DeleteTransactionUseCase(repository);
  });

  it('should delete transaction when parameters are valid', async () => {
    const transaction = Transaction.create({
      id: 'test-id',
      accountId: 'test-account-id',
      userId: 'test-user-id',
      amount: 500,
      type: 'EXPENSE',
      categoryId: '1',
      description: 'Dinner',
      date: new Date(),
    });

    repository.findById.mockResolvedValue(transaction);

    await deleteTransactionUseCase.execute({
      id: 'test-id',
      userId: 'test-user-id',
    });

    expect(repository.delete.mock.calls.length).toBeGreaterThan(0);
    expect(repository.delete.mock.calls[0][0]).toBe('test-id');
  });

  it('should return an error when id does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      deleteTransactionUseCase.execute({
        id: 'non-existing-id',
        userId: 'non-existing-user-id',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(repository.delete.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should return an error transaction does not belong to user', async () => {
    const transaction = Transaction.create({
      id: 'test-id',
      accountId: 'test-account-id',
      userId: 'invalid-user-id',
      amount: 500,
      type: 'EXPENSE',
      categoryId: '1',
      description: 'Dinner',
      date: new Date(),
    });

    repository.findById.mockResolvedValue(transaction);

    await expect(
      deleteTransactionUseCase.execute({
        id: 'test-id',
        userId: 'non-existing-user-id',
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(repository.delete.mock.calls.length).not.toBeGreaterThan(0);
  });
});

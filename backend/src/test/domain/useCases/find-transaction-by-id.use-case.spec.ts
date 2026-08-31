import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Transaction } from '../../../domain/transaction/domain/entity/transaction.entity';
import { ITransactionRepository } from '../../../domain/transaction/repository/transaction.repository';
import { FindTransactionByIdUseCase } from '../../../domain/transaction/useCases/find-transaction-by-id.use-case';

describe('FindTransactionByIdUseCase', () => {
  let repository: jest.Mocked<ITransactionRepository>;
  let findTransactionByIdUseCase: FindTransactionByIdUseCase;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByAccountId: jest.fn(),
      delete: jest.fn(),
    };

    findTransactionByIdUseCase = new FindTransactionByIdUseCase(repository);
  });

  it('should return transaction with the given id', async () => {
    const transaction = Transaction.create({
      id: '12345',
      accountId: 'test-account-id',
      userId: 'test-user-id',
      amount: 500,
      type: 'INCOME',
      categoryId: '2',
      description: 'Food',
      date: new Date(),
    });

    repository.findById.mockResolvedValue(transaction);

    const useCase = await findTransactionByIdUseCase.execute(
      '12345',
      'test-user-id',
    );

    expect(useCase).toBeDefined();
    expect(useCase.getId()).toBe('12345');
    expect(useCase.getUserId()).toBe('test-user-id');
    expect(useCase.getAccountId()).toBe('test-account-id');
    expect(useCase.getAmount()).toBe(500);
    expect(useCase.getType()).toBe('INCOME');
    expect(useCase.getCategoryId()).toBe('2');
    expect(useCase.getDescription()).toBe('Food');
  });

  it('should throw an error if id is non existing', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      findTransactionByIdUseCase.execute(
        'non-existing-id',
        'non-existing-user-id',
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw an error if the transaction does not belong to user', async () => {
    const transaction = Transaction.create({
      id: '12345',
      accountId: 'test-account-id',
      userId: 'test-user-id',
      amount: 500,
      type: 'INCOME',
      categoryId: '2',
      description: 'Food',
      date: new Date(),
    });

    repository.findById.mockResolvedValue(transaction);

    await expect(
      findTransactionByIdUseCase.execute('12345', 'non-existing-user-id'),
    ).rejects.toThrow(ForbiddenException);
  });
});

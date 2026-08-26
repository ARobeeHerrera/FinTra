import { NotFoundException } from '@nestjs/common';
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
      accountId: '12345',
      amount: 500,
      type: 'INCOME',
      categoryId: '2',
      description: 'Food',
      date: new Date(),
    });

    repository.findById.mockResolvedValue(transaction);

    const useCase = await findTransactionByIdUseCase.execute('12345');

    expect(useCase.getId()).toBe('12345');
  });

  it('should throw an error if id is non existing', async () => {
    await expect(
      findTransactionByIdUseCase.execute('non-existing-id'),
    ).rejects.toThrow(NotFoundException);
  });
});

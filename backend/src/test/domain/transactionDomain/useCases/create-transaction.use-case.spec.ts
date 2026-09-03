import { CreateTransactionUseCase } from '../../../../domain/transaction/useCases/create-transaction.use-case';
import { ITransactionRepository } from '../../../../domain/transaction/repository/transaction.repository';

describe('CreateTransactionUseCase', () => {
  let repository: jest.Mocked<ITransactionRepository>;
  let createTransactionUseCase: CreateTransactionUseCase;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByAccountId: jest.fn(),
      delete: jest.fn(),
    };

    createTransactionUseCase = new CreateTransactionUseCase(repository);
  });

  it('should create a valid transaction using the transaction use case', async () => {
    await createTransactionUseCase.execute({
      accountId: 'test-account-id',
      userId: 'test-user-id',
      amount: 500,
      type: 'EXPENSE',
      categoryId: '1',
      description: 'Lunch',
      date: new Date(),
    });

    const savedTransaction = repository.save.mock.calls[0][0];

    expect(repository.save.mock.calls.length).toBeGreaterThan(0);
    expect(savedTransaction.getAccountId()).toBe('test-account-id');
    expect(savedTransaction.getUserId()).toBe('test-user-id');
    expect(savedTransaction.getAmount()).toBe(500);
    expect(savedTransaction.getType()).toBe('EXPENSE');
    expect(savedTransaction.getCategoryId()).toBe('1');
    expect(savedTransaction.getDescription()).toBe('Lunch');
  });

  it('should throw an error if the amount is equal to 0', async () => {
    await expect(
      createTransactionUseCase.execute({
        accountId: 'test-account-id',
        userId: 'test-user-id',
        amount: 0,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
    ).rejects.toThrow('Amount must be a positive number');

    expect(repository.save.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should throw an error if the amount is negative ', async () => {
    await expect(
      createTransactionUseCase.execute({
        accountId: 'test-account-id',
        userId: 'test-user-id',
        amount: -500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
    ).rejects.toThrow('Amount must be a positive number');

    expect(repository.save.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should throw an error if the account id is empty', async () => {
    await expect(
      createTransactionUseCase.execute({
        accountId: '',
        userId: 'test-user-id',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
    ).rejects.toThrow('Account ID cannot be empty');

    expect(repository.save.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should throw an error if the category id is empty', async () => {
    await expect(
      createTransactionUseCase.execute({
        accountId: 'test-account-id',
        userId: 'test-user-id',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '',
        description: 'Lunch',
        date: new Date(),
      }),
    ).rejects.toThrow('Category ID cannot be empty');

    expect(repository.save.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should throw an error if the description is empty', async () => {
    await expect(
      createTransactionUseCase.execute({
        accountId: 'test-account-id',
        userId: 'test-user-id',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: '',
        date: new Date(),
      }),
    ).rejects.toThrow('Description cannot be empty');

    expect(repository.save.mock.calls.length).not.toBeGreaterThan(0);
  });
});

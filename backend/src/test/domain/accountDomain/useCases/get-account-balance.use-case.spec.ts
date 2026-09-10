import { GetAccountBalanceUseCase } from '../../../../domain/account/useCase/get-account-balance.use-case';
import { IAccountRepository } from '../../../../domain/account/repository/account.repository';
import { ITransactionRepository } from '../../../../domain/transaction/repository/transaction.repository';
import { Account } from '../../../../domain/account/domain/entity/account.entity';
import { Transaction } from '../../../../domain/transaction/domain/entity/transaction.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetAccountBalanceUseCase', () => {
  let accountRepository: jest.Mocked<IAccountRepository>;
  let transactionRepository: jest.Mocked<ITransactionRepository>;
  let getAccountBalanceUseCase: GetAccountBalanceUseCase;

  beforeEach(() => {
    accountRepository = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    transactionRepository = {
      save: jest.fn(),
      findByAccountId: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    getAccountBalanceUseCase = new GetAccountBalanceUseCase(
      accountRepository,
      transactionRepository,
    );
  });

  it('should return account with its balance successfully', async () => {
    const account = Account.create({
      id: 'test-id',
      userId: 'test-user-id',
      name: 'My Bank Account',
      currency: 'PHP',
    });

    accountRepository.findByUserId.mockResolvedValue(account);

    transactionRepository.findByAccountId.mockResolvedValue([
      Transaction.create({
        id: 'test-id',
        accountId: 'test-account-id',
        userId: 'test-user-id',
        amount: 500,
        type: 'INCOME',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
      Transaction.create({
        id: 'test-id',
        accountId: 'test-account-id',
        userId: 'test-user-id',
        amount: 200,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
    ]);

    const accountBalance =
      await getAccountBalanceUseCase.execute('test-user-id');

    expect(accountBalance).toBe(300);
  });

  it('should return 0 if transaction does not exist on validated account', async () => {
    const account = Account.create({
      id: 'test-id',
      userId: 'test-user-id',
      name: 'My Bank Account',
      currency: 'PHP',
    });

    accountRepository.findByUserId.mockResolvedValue(account);

    transactionRepository.findByAccountId.mockResolvedValue([]);

    const accountBalance =
      await getAccountBalanceUseCase.execute('test-user-id');

    expect(accountBalance).toBe(0);
  });

  it('should throw an error if account does not exist or if account is null', async () => {
    accountRepository.findByUserId.mockResolvedValue(null);

    await expect(
      getAccountBalanceUseCase.execute('non-existing-user-id'),
    ).rejects.toThrow(NotFoundException);
  });
});

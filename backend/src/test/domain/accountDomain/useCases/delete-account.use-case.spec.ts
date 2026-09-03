import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Account } from '../../../../domain/account/domain/entity/account.entity';
import { IAccountRepository } from '../../../../domain/account/repository/account.repository';
import { DeleteAccountUseCase } from '../../../../domain/account/useCase/delete-account.use-case';
import { ITransactionRepository } from '../../../../domain/transaction/repository/transaction.repository';
import { Transaction } from '../../../../domain/transaction/domain/entity/transaction.entity';

describe('DeleteAccountUseCase', () => {
  let accountRepository: jest.Mocked<IAccountRepository>;
  let transactionRepository: jest.Mocked<ITransactionRepository>;
  let deleteAccountUseCase: DeleteAccountUseCase;

  beforeEach(() => {
    accountRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    };

    transactionRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByAccountId: jest.fn(),
      delete: jest.fn(),
    };

    deleteAccountUseCase = new DeleteAccountUseCase(
      accountRepository,
      transactionRepository,
    );
  });

  it('should successfully delete a account when all validation is correct', async () => {
    accountRepository.findById.mockResolvedValue(
      Account.create({
        id: 'test-id',
        userId: 'test-user-id',
        name: 'My Bank',
        currency: 'USD',
      }),
    );

    transactionRepository.findByAccountId.mockResolvedValue([]);

    await deleteAccountUseCase.execute({
      id: 'test-id',
      userId: 'test-user-id',
    });

    expect(accountRepository.delete.mock.calls.length).toBeGreaterThan(0);
    expect(accountRepository.delete.mock.calls[0]).toStrictEqual(['test-id']);
  });

  it('should throw an error when account does not exist', async () => {
    accountRepository.findById.mockResolvedValue(null);

    await expect(
      deleteAccountUseCase.execute({
        id: 'non-existing-id',
        userId: 'test-user-id',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(accountRepository.delete.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should throw an error if account does not belong to user', async () => {
    accountRepository.findById.mockResolvedValue(
      Account.create({
        id: 'test-id',
        userId: 'test-user-id',
        name: 'My Bank',
        currency: 'USD',
      }),
    );

    transactionRepository.findByAccountId.mockResolvedValue([]);

    await expect(
      deleteAccountUseCase.execute({
        id: 'test-id',
        userId: 'non-existing-id',
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(accountRepository.delete.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should throw an error when transaction exist on account', async () => {
    accountRepository.findById.mockResolvedValue(
      Account.create({
        id: 'test-id',
        userId: 'test-user-id',
        name: 'My Bank',
        currency: 'USD',
      }),
    );

    transactionRepository.findByAccountId.mockResolvedValue([
      Transaction.create({
        id: 'test-id',
        accountId: 'test-account-id',
        userId: 'test-user-id',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
    ]);

    await expect(
      deleteAccountUseCase.execute({
        id: 'test-id',
        userId: 'test-user-id',
      }),
    ).rejects.toThrow(ConflictException);

    expect(accountRepository.delete.mock.calls.length).not.toBeGreaterThan(0);
  });
});

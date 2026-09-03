/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException } from '@nestjs/common';
import { Account } from '../../../../domain/account/domain/entity/account.entity';
import { IAccountRepository } from '../../../../domain/account/repository/account.repository';
import { CreateAccountUseCase } from '../../../../domain/account/useCase/create-account.use-case';

describe('CreateAccountUseCase', () => {
  let createAccountUseCase: CreateAccountUseCase;
  let accountRepository: jest.Mocked<IAccountRepository>;

  beforeEach(() => {
    accountRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    };

    createAccountUseCase = new CreateAccountUseCase(accountRepository);
  });

  it('should create an account and call the repository save method', async () => {
    await createAccountUseCase.execute({
      userId: 'test-user-id',
      name: 'Test Account',
      currency: 'USD',
    });

    const savedAccount = accountRepository.save.mock.calls[0][0];

    expect(accountRepository.save.mock.calls.length).toBeGreaterThan(0);
    expect(savedAccount.getId()).toBeDefined();
    expect(savedAccount.getUserId()).toBe('test-user-id');
    expect(savedAccount.getName()).toBe('Test Account');
    expect(savedAccount.getCurrency()).toBe('USD');
  });

  it('should throw an error if the name is empty', async () => {
    await expect(
      createAccountUseCase.execute({
        userId: 'test-user-id',
        name: '',
        currency: 'USD',
      }),
    ).rejects.toThrow('Name cannot be empty');

    expect(accountRepository.save.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should throw an error if the currency is invalid', async () => {
    await expect(
      createAccountUseCase.execute({
        userId: 'test-user-id',
        name: 'Test Account',
        currency: 'EUR' as any,
      }),
    ).rejects.toThrow('Currency must be PHP, USD, JPY, OR SGD');

    expect(accountRepository.save.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should throw an error if the user already has an account', async () => {
    accountRepository.findByUserId.mockResolvedValueOnce(
      Account.create({
        id: 'existing-account-id',
        userId: 'test-user-id',
        name: 'Existing Account',
        currency: 'USD',
      }),
    );

    await expect(
      createAccountUseCase.execute({
        userId: 'test-user-id',
        name: 'Banking Test',
        currency: 'USD',
      }),
    ).rejects.toThrow(ConflictException);

    expect(accountRepository.save.mock.calls.length).not.toBeGreaterThan(0);
  });
});

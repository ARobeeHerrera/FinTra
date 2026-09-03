import { ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  Account,
  CurrencyType,
} from '../../../../domain/account/domain/entity/account.entity';
import { IAccountRepository } from '../../../../domain/account/repository/account.repository';
import { UpdateAccountUseCase } from '../../../../domain/account/useCase/update-account.use-case';

describe('UpdateAccountUseCase', () => {
  let repository: jest.Mocked<IAccountRepository>;
  let updateAccountUseCase: UpdateAccountUseCase;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    };

    updateAccountUseCase = new UpdateAccountUseCase(repository);
  });

  it('should update the existing account with the correct parameters', async () => {
    repository.findById.mockResolvedValue(
      Account.create({
        id: 'test-id',
        userId: 'test-user-id',
        name: 'Test Name',
        currency: 'USD',
      }),
    );

    await updateAccountUseCase.execute({
      id: 'test-id',
      userId: 'test-user-id',
      name: 'Test Name Update',
      currency: 'PHP',
    });

    const updatedAccount = repository.save.mock.calls[0][0];

    expect(repository.save.mock.calls.length).toBeGreaterThan(0);
    expect(updatedAccount.getId()).toBe('test-id');
    expect(updatedAccount.getUserId()).toBe('test-user-id');
    expect(updatedAccount.getName()).toBe('Test Name Update');
    expect(updatedAccount.getCurrency()).toBe('PHP');
  });

  it('should throw an error if name is empty', async () => {
    repository.findById.mockResolvedValue(
      Account.create({
        id: 'test-id',
        userId: 'test-user-id',
        name: 'Test Name',
        currency: 'USD',
      }),
    );

    await expect(
      updateAccountUseCase.execute({
        id: 'test-id',
        userId: 'test-user-id',
        name: '',
        currency: 'PHP',
      }),
    ).rejects.toThrow('Name cannot be empty');
    expect(repository.save.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should throw an error if currency does not belong to currencyType', async () => {
    repository.findById.mockResolvedValue(
      Account.create({
        id: 'test-id',
        userId: 'test-user-id',
        name: 'Test Name',
        currency: 'USD',
      }),
    );

    await expect(
      updateAccountUseCase.execute({
        id: 'test-id',
        userId: 'test-user-id',
        name: 'Test Name Update',
        currency: 'EUR' as CurrencyType,
      }),
    ).rejects.toThrow('Currency must be PHP, USD, JPY, OR SGD');
    expect(repository.save.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should throw an error if account does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      updateAccountUseCase.execute({
        id: 'non-existing-id',
        userId: 'non-existing-user-id',
        name: 'My Bank',
        currency: 'PHP',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(repository.save.mock.calls.length).not.toBeGreaterThan(0);
  });

  it('should throw an error if account does not belong to current user', async () => {
    repository.findById.mockResolvedValue(
      Account.create({
        id: 'test-id',
        userId: 'test-user-id',
        name: 'Test Name',
        currency: 'USD',
      }),
    );

    await expect(
      updateAccountUseCase.execute({
        id: 'test-id',
        userId: 'non-existing-user-id',
        name: 'My Bank',
        currency: 'PHP',
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(repository.save.mock.calls.length).not.toBeGreaterThan(0);
  });
});

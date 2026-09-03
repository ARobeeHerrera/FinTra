import { NotFoundException } from '@nestjs/common';
import { Account } from '../../../../domain/account/domain/entity/account.entity';
import { IAccountRepository } from '../../../../domain/account/repository/account.repository';
import { FindAccountByUserIdUseCase } from '../../../../domain/account/useCase/find-account-by-user-id.use-case';

describe('FindAccountByUserIdUseCase', () => {
  let repository: jest.Mocked<IAccountRepository>;
  let findAccountByUserIdUseCase: FindAccountByUserIdUseCase;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    };

    findAccountByUserIdUseCase = new FindAccountByUserIdUseCase(repository);
  });

  it('should return an account with the given id', async () => {
    const account = Account.create({
      id: 'test-account-id',
      userId: 'test-user-id',
      name: 'Test Account',
      currency: 'USD',
    });

    repository.findByUserId.mockResolvedValueOnce(account);

    const savedAccount =
      await findAccountByUserIdUseCase.execute('test-user-id');

    expect(repository.findByUserId.mock.calls.length).toBeGreaterThan(0);
    expect(savedAccount).toBeInstanceOf(Account);
    expect(savedAccount?.getId()).toBe('test-account-id');
    expect(savedAccount?.getUserId()).toBe('test-user-id');
    expect(savedAccount?.getName()).toBe('Test Account');
    expect(savedAccount?.getCurrency()).toBe('USD');
  });

  it('should throw an error when account does not exist on this user', async () => {
    repository.findByUserId.mockResolvedValueOnce(null);

    await expect(
      findAccountByUserIdUseCase.execute('non-existent-user-id'),
    ).rejects.toThrow(NotFoundException);
  });
});

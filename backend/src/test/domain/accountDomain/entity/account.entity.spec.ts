/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Account } from '../../../../domain/account/domain/entity/account.entity';

describe('AccountEntity', () => {
  it('should successfully create a Account entity', () => {
    const account = Account.create({
      id: 'test-id',
      userId: 'test-user-id',
      name: 'My Account',
      currency: 'PHP',
    });

    expect(account.getId()).toBe('test-id');
    expect(account.getUserId()).toBe('test-user-id');
    expect(account.getName()).toBe('My Account');
    expect(account.getCurrency()).toBe('PHP');
  });

  it('should throw an error when id does not exist', () => {
    expect(() => {
      Account.create({
        id: '',
        userId: 'test-user-id',
        name: 'My Account',
        currency: 'PHP',
      });
    }).toThrow('Account Id cannot be empty');
  });

  it('should throw an error when user id does not exist', () => {
    expect(() => {
      Account.create({
        id: 'test-id',
        userId: '',
        name: 'My Account',
        currency: 'PHP',
      });
    }).toThrow('User Id cannot be empty');
  });

  it('should throw an error when name does not exist', () => {
    expect(() => {
      Account.create({
        id: 'test-id',
        userId: 'test-user-id',
        name: '',
        currency: 'PHP',
      });
    }).toThrow('Name cannot be empty');
  });

  it('should successfully update currency with correct type', () => {
    const account = Account.create({
      id: 'test-id',
      userId: 'test-user-id',
      name: 'My Account',
      currency: 'PHP',
    });

    account.updateCurrency('USD');
    expect(account.getCurrency()).toBe('USD');
  });

  it('should successfully update name of the account entity', () => {
    const account = Account.create({
      id: 'test-id',
      userId: 'test-user-id',
      name: 'My Account',
      currency: 'PHP',
    });

    account.updateName('Banking');
    expect(account.getName()).toBe('Banking');
  });

  it('should throw an error when creating an account with invalid currency type', () => {
    expect(() => {
      Account.create({
        id: 'test-id',
        userId: 'test-user-id',
        name: 'My Account',
        currency: 'EUR' as any,
      });
    }).toThrow('Currency must be PHP, USD, JPY, OR SGD');
  });

  it('should throw an error when updating name with empty string', () => {
    const account = Account.create({
      id: 'test-id',
      userId: 'test-user-id',
      name: 'My Account',
      currency: 'PHP',
    });

    expect(() => {
      account.updateName('');
    }).toThrow('Name cannot be empty');
  });

  it('should throw an error when updating currency with invalid type', () => {
    const account = Account.create({
      id: 'test-id',
      userId: 'test-user-id',
      name: 'My Account',
      currency: 'PHP',
    });

    expect(() => {
      account.updateCurrency('EUR' as any);
    }).toThrow('Currency must be PHP, USD, JPY, OR SGD');
  });
});

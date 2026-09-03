import { AccountMapper } from '../../../../../domain/account/infrastructure/mapper/account.mapper';
import {
  Account,
  CurrencyType,
} from '../../../../../domain/account/domain/entity/account.entity';

describe('AccountMapper', () => {
  it('should map a PrismaAccount to domain Account', () => {
    const prismaAccount = {
      id: 'test-id',
      userId: 'test-user-id',
      name: 'Test Account',
      currency: 'USD' as CurrencyType,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const domainAccount = AccountMapper.toDomain(prismaAccount);

    expect(domainAccount.getId()).toBe(prismaAccount.id);
    expect(domainAccount.getUserId()).toBe(prismaAccount.userId);
    expect(domainAccount.getName()).toBe(prismaAccount.name);
    expect(domainAccount.getCurrency()).toBe(prismaAccount.currency);
  });

  it('should throw an error if name is empty when mapping to domain account', () => {
    const prismaAccount = {
      id: 'test-id',
      userId: 'test-user-id',
      name: '',
      currency: 'USD' as CurrencyType,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(() => AccountMapper.toDomain(prismaAccount)).toThrow(
      'Name cannot be empty',
    );
  });

  it('should persist a domain Account to PrismaAccount', () => {
    const domainAccount = Account.create({
      id: 'test-id',
      userId: 'test-user-id',
      name: 'Test Account',
      currency: 'USD',
    });

    const prismaAccount = AccountMapper.toPersistence(domainAccount);

    expect(prismaAccount.id).toBe(domainAccount.getId());
    expect(prismaAccount.userId).toBe(domainAccount.getUserId());
    expect(prismaAccount.name).toBe(domainAccount.getName());
    expect(prismaAccount.currency).toBe(domainAccount.getCurrency());
  });
});

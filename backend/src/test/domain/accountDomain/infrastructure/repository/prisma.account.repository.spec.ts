/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Account } from '../../../../../domain/account/domain/entity/account.entity';
import { PrismaAccountRepository } from '../../../../../domain/account/infrastructure/mapper/repository/prisma.account.repository';

describe('PrismaAccountRepository', () => {
  let repository: PrismaAccountRepository;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      account: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };

    repository = new PrismaAccountRepository(prismaMock);
  });

  it('should save an account with correct parameters', async () => {
    const account = Account.create({
      id: 'test-id',
      userId: 'test-user-id',
      name: 'Test Account',
      currency: 'USD',
    });

    await repository.save(account);

    expect(prismaMock.account.upsert).toHaveBeenCalledWith({
      where: { id: account.getId() },
      create: {
        id: account.getId(),
        userId: account.getUserId(),
        name: account.getName(),
        currency: account.getCurrency(),
      },
      update: {
        id: account.getId(),
        userId: account.getUserId(),
        name: account.getName(),
        currency: account.getCurrency(),
      },
    });
  });

  it('should find an account by ID', async () => {
    prismaMock.account.findUnique.mockResolvedValue({
      id: 'test-id',
      userId: 'test-user-id',
      name: 'Test Account',
      currency: 'USD',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const account = await repository.findById('test-id');
    expect(prismaMock.account.findUnique).toHaveBeenCalledWith({
      where: { id: 'test-id' },
    });

    expect(account).toBeInstanceOf(Account);
    expect(account?.getId()).toBe('test-id');
    expect(account?.getUserId()).toBe('test-user-id');
    expect(account?.getName()).toBe('Test Account');
    expect(account?.getCurrency()).toBe('USD');
  });

  it('should return null if account not found by ID', async () => {
    prismaMock.account.findUnique.mockResolvedValue(null);

    const account = await repository.findById('non-existent-id');

    expect(account).toBeNull();
  });

  it('should find an account by user ID', async () => {
    prismaMock.account.findUnique.mockResolvedValue({
      id: 'test-id',
      userId: 'test-user-id',
      name: 'Test Account',
      currency: 'USD',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const account = await repository.findByUserId('test-user-id');

    expect(prismaMock.account.findUnique).toHaveBeenCalledWith({
      where: { userId: 'test-user-id' },
    });
    expect(account).toBeInstanceOf(Account);
    expect(account?.getId()).toBe('test-id');
    expect(account?.getUserId()).toBe('test-user-id');
    expect(account?.getName()).toBe('Test Account');
    expect(account?.getCurrency()).toBe('USD');
  });
});

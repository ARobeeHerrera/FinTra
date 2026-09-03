import { Account } from '../../domain/entity/account.entity';
import { Account as PrismaAccount } from '../../../../../prisma/generated/client';

export class AccountMapper {
  static toDomain(raw: PrismaAccount): Account {
    return Account.create({
      id: raw.id,
      userId: raw.userId,
      name: raw.name,
      currency: raw.currency,
    });
  }

  static toPersistence(
    account: Account,
  ): Omit<PrismaAccount, 'createdAt' | 'updatedAt'> {
    return {
      id: account.getId(),
      userId: account.getUserId(),
      name: account.getName(),
      currency: account.getCurrency(),
    };
  }
}

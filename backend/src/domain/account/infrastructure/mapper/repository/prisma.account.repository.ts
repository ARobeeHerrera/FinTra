import { PrismaService } from '../../../../../shared/infrastructure/prisma/prisma.service';
import { IAccountRepository } from '../../../repository/account.repository';
import { Account } from '../../../domain/entity/account.entity';
import { AccountMapper } from '../account.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAccountRepository implements IAccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(account: Account): Promise<void> {
    const accountCreation = AccountMapper.toPersistence(account);

    await this.prismaService.account.upsert({
      where: { id: accountCreation.id },
      update: accountCreation,
      create: accountCreation,
    });
  }

  async findById(id: string): Promise<Account | null> {
    const account = await this.prismaService.account.findUnique({
      where: { id },
    });

    return account ? AccountMapper.toDomain(account) : null;
  }

  async findByUserId(userId: string): Promise<Account | null> {
    const account = await this.prismaService.account.findUnique({
      where: { userId },
    });

    return account ? AccountMapper.toDomain(account) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.account.delete({ where: { id } });
  }
}

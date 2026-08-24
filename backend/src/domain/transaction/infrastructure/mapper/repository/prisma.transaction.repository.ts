import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../shared/infrastructure/prisma/prisma.service';
import { ITransactionRepository } from '../../../repository/transaction.repository';
import { Transaction } from '../../../domain/entity/transaction.entity';
import { TransactionMapper } from '../../mapper/transaction.mapper';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(transaction: Transaction): Promise<void> {
    const prismaTransaction = TransactionMapper.toPersistence(transaction);

    await this.prismaService.transaction.upsert({
      where: { id: prismaTransaction.id },
      update: prismaTransaction,
      create: prismaTransaction,
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    const raw = await this.prismaService.transaction.findUnique({
      where: { id },
    });
    return raw ? TransactionMapper.toDomain(raw) : null;
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const rows = await this.prismaService.transaction.findMany({
      where: { accountId },
    });
    return rows.map((row) => TransactionMapper.toDomain(row));
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.transaction.delete({
      where: { id },
    });
  }
}

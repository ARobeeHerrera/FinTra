/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { CreateTransactionUseCase } from '../../../domain/transaction/useCases/create-transaction.use-case';
import { CreateTransactionDTO } from '../dto/CreateTransactionDTO';
import { Transaction } from '../domain/entity/transaction.entity';
import { FindTransactionByIdUseCase } from '../useCases/find-transaction-by-id.use-case';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly findTransactionByIdUseCase: FindTransactionByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTransactionDTO): Promise<Transaction> {
    const transaction = await this.createTransactionUseCase.execute(
      dto.userId,
      dto.accountId,
      dto.amount,
      dto.type,
      dto.categoryId,
      dto.description,
      new Date(dto.date),
    );

    return transaction;
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Transaction> {
    const transaction = await this.findTransactionByIdUseCase.execute(id);

    return transaction;
  }
}

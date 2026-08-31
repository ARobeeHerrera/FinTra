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
  UseGuards,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateTransactionUseCase } from '../../../domain/transaction/useCases/create-transaction.use-case';
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from '../dto/TransactionDTO';
import { Transaction } from '../domain/entity/transaction.entity';
import { FindTransactionByIdUseCase } from '../useCases/find-transaction-by-id.use-case';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth-guard';
import { AuthenticatedRequest } from '../../../auth/presentation/auth-controller';
import { UpdateTransactionUseCase } from '../useCases/update-transaction.use-case';
import { FindTransactionByAccountIdUseCase } from '../useCases/find-transaction-by-account-id.use-case';
import { DeleteTransactionUseCase } from '../useCases/delete-transaction.use-case';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly findTransactionByIdUseCase: FindTransactionByIdUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly findTransactionByAccountIdUseCase: FindTransactionByAccountIdUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(
    @Body() dto: CreateTransactionDTO,
    @Req() req: AuthenticatedRequest,
  ): Promise<Transaction> {
    const transaction = await this.createTransactionUseCase.execute({
      ...dto,
      userId: req.user.id,
      date: new Date(dto.date),
    });

    return transaction;
  }

  @Get(':id')
  async findTransactionById(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Transaction> {
    const transaction = await this.findTransactionByIdUseCase.execute(
      id,
      req.user.id,
    );

    return transaction;
  }

  @Get('account/:accountId')
  async findTransactionByAccountId(
    @Param('accountId') accountId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Transaction[]> {
    const transactions = await this.findTransactionByAccountIdUseCase.execute(
      accountId,
      req.user.id,
    );

    return transactions;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateTransaction(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDTO,
    @Req() req: AuthenticatedRequest,
  ): Promise<Transaction> {
    const userId = req.user.id;
    const transaction = await this.updateTransactionUseCase.execute({
      ...dto,
      id,
      userId,
    });

    return transaction;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    await this.deleteTransactionUseCase.execute({
      id: id,
      userId: req.user.id,
    });
  }
}

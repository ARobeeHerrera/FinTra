/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { TransactionModule } from '../../../domain/transaction/transaction.module';
import { CreateTransactionUseCase } from '../../../domain/transaction/useCases/create-transaction.use-case';
import { Transaction } from '../../../domain/transaction/domain/entity/transaction.entity';
import { FindTransactionByIdUseCase } from '../../../domain/transaction/useCases/find-transaction-by-id.use-case';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth-guard';
import { AuthenticatedRequest } from '../../../auth/presentation/auth-controller';
import { DeleteTransactionUseCase } from '../../../domain/transaction/useCases/delete-transaction.use-case';
import { FindTransactionByAccountIdUseCase } from '../../../domain/transaction/useCases/find-transaction-by-account-id.use-case';
import { UpdateTransactionUseCase } from '../../../domain/transaction/useCases/update-transaction.use-case';

describe('Transaction Controller', () => {
  let app: INestApplication;
  const mockCreateTransactionUseCase = { execute: jest.fn() };
  const mockFindTransactionUseCase = { execute: jest.fn() };
  const mockFindTransactionAccountByIdUseCase = { execute: jest.fn() };
  const mockUpdateTransactionUseCase = { execute: jest.fn() };
  const mockDeleteTransactionUseCase = { execute: jest.fn() };

  beforeAll(async () => {
    const moduleReference = await Test.createTestingModule({
      imports: [TransactionModule],
    })
      .overrideProvider(CreateTransactionUseCase)
      .useValue(mockCreateTransactionUseCase)
      .overrideProvider(FindTransactionByIdUseCase)
      .useValue(mockFindTransactionUseCase)
      .overrideProvider(FindTransactionByAccountIdUseCase)
      .useValue(mockFindTransactionAccountByIdUseCase)
      .overrideProvider(UpdateTransactionUseCase)
      .useValue(mockUpdateTransactionUseCase)
      .overrideProvider(DeleteTransactionUseCase)
      .useValue(mockDeleteTransactionUseCase)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
          req.user = {
            id: 'test-user-id',
            email: 'test@example.com',
            googleId: 'test@gmail.com',
          };
          return true;
        },
      })
      .compile();

    app = moduleReference.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 201 with the created id', async () => {
    mockCreateTransactionUseCase.execute.mockResolvedValue(
      Transaction.create({
        id: 'xyz-1234',
        accountId: '091823',
        userId: '091823',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date('2026-08-25'),
      }),
    );

    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send({
        accountId: '091823',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date('2026-08-25'),
      });

    expect(mockCreateTransactionUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'test-user-id' }),
    );
    expect(response.status).toBe(201);
  });

  it('should return 400 for missing required fields', async () => {
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send({
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date('2026-08-25'),
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('accountId should not be empty');
  });

  it('should return 400 for having negative amount', async () => {
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send({
        accountId: '091823',
        amount: -100,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date('2026-08-25'),
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('amount must be a positive number');
  });

  it('should return 200 if the transaction exist', async () => {
    mockFindTransactionUseCase.execute.mockResolvedValue(
      Transaction.create({
        id: 'xyz-1234',
        accountId: '091823',
        userId: 'test-user-id',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
    );

    const response = await request(app.getHttpServer()).get(
      '/transactions/xyz-1234',
    );

    expect(response.status).toBe(200);
    expect(mockFindTransactionUseCase.execute).toHaveBeenCalledWith(
      'xyz-1234',
      'test-user-id',
    );

    expect(response.body.amount).toBe(500);
    expect(response.body.type).toEqual('EXPENSE');
    expect(response.body.categoryId).toBe('1');
    expect(response.body.description).toBe('Lunch');
  });

  it('should be status 200 and return transaction with the given accountId', async () => {
    mockFindTransactionAccountByIdUseCase.execute.mockResolvedValue([
      Transaction.create({
        id: 'xyz-1234',
        accountId: '091823',
        userId: 'test-user-id',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
      Transaction.create({
        id: '12345',
        accountId: '091823',
        userId: 'test-user-id',
        amount: 200,
        type: 'INCOME',
        categoryId: '2',
        description: 'Allowance',
        date: new Date(),
      }),
    ]);

    const response = await request(app.getHttpServer()).get(
      '/transactions/account/091823',
    );

    expect(response.status).toBe(200);
    expect(mockFindTransactionAccountByIdUseCase.execute).toHaveBeenCalledWith(
      '091823',
      'test-user-id',
    );

    expect(response.body).toHaveLength(2);
    expect(response.body[0].amount).toBe(500);
    expect(response.body[0].type).toEqual('EXPENSE');
    expect(response.body[0].categoryId).toBe('1');
    expect(response.body[0].description).toBe('Lunch');
    expect(response.body[1].amount).toBe(200);
    expect(response.body[1].type).toBe('INCOME');
    expect(response.body[1].categoryId).toBe('2');
    expect(response.body[1].description).toBe('Allowance');
  });

  it('should return status 200 and update the existing transaction', async () => {
    mockUpdateTransactionUseCase.execute.mockResolvedValue(
      Transaction.create({
        id: 'xyz-1234',
        accountId: '091823',
        userId: 'test-user-id',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
    );

    const response = await request(app.getHttpServer())
      .patch('/transactions/xyz-1234')
      .send({
        amount: 200,
      });

    expect(mockUpdateTransactionUseCase.execute).toHaveBeenCalledWith({
      id: 'xyz-1234',
      userId: 'test-user-id',
      amount: 200,
    });

    expect(response.status).toBe(200);
  });

  it('should return status 400 when amount is non positive', async () => {
    mockUpdateTransactionUseCase.execute.mockResolvedValue(
      Transaction.create({
        id: 'xyz-1234',
        accountId: '091823',
        userId: 'test-user-id',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
    );

    const response = await request(app.getHttpServer())
      .patch('/transactions/xyz-1234')
      .send({
        amount: 0,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('amount must be a positive number');
  });

  it('should return status 400 when type is not in the selection [INCOME, EXPENSE]', async () => {
    mockUpdateTransactionUseCase.execute.mockResolvedValue(
      Transaction.create({
        id: 'xyz-1234',
        accountId: '091823',
        userId: 'test-user-id',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
    );

    const response = await request(app.getHttpServer())
      .patch('/transactions/xyz-1234')
      .send({
        type: 'SAVINGS',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      'type must be one of the following values: INCOME, EXPENSE',
    );
  });

  it('should return status 400 when categoryId is not string value', async () => {
    mockUpdateTransactionUseCase.execute.mockResolvedValue(
      Transaction.create({
        id: 'xyz-1234',
        accountId: '091823',
        userId: 'test-user-id',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
    );

    const response = await request(app.getHttpServer())
      .patch('/transactions/xyz-1234')
      .send({
        categoryId: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('categoryId must be a string');
  });

  it('should return status 400 when description is not string value', async () => {
    mockUpdateTransactionUseCase.execute.mockResolvedValue(
      Transaction.create({
        id: 'xyz-1234',
        accountId: '091823',
        userId: 'test-user-id',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
    );

    const response = await request(app.getHttpServer())
      .patch('/transactions/xyz-1234')
      .send({
        description: 123,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('description must be a string');
  });

  it('should return status 400 when date is not type(DATE)', async () => {
    mockUpdateTransactionUseCase.execute.mockResolvedValue(
      Transaction.create({
        id: 'xyz-1234',
        accountId: '091823',
        userId: 'test-user-id',
        amount: 500,
        type: 'EXPENSE',
        categoryId: '1',
        description: 'Lunch',
        date: new Date(),
      }),
    );

    const response = await request(app.getHttpServer())
      .patch('/transactions/xyz-1234')
      .send({
        date: '08-30-2026',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      'date must be a valid ISO 8601 date string',
    );
  });

  it('should return status 200 and delete the transaction with the right id', async () => {
    const response = await request(app.getHttpServer()).delete(
      '/transactions/xyz-1234',
    );

    expect(response.status).toBe(204);
    expect(mockDeleteTransactionUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'xyz-1234', userId: 'test-user-id' }),
    );
  });
});

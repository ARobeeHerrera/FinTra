/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { TransactionModule } from '../../../domain/transaction/transaction.module';
import { CreateTransactionUseCase } from '../../../domain/transaction/useCases/create-transaction.use-case';
import { Transaction } from '../../../domain/transaction/domain/entity/transaction.entity';
import { FindTransactionByIdUseCase } from '../../../domain/transaction/useCases/find-transaction-by-id.use-case';

describe('Transaction Controller', () => {
  let app: INestApplication;
  const mockCreateTransactionUseCase = { execute: jest.fn() };
  const mockFindTransactionUseCase = { execute: jest.fn() };

  beforeAll(async () => {
    const moduleReference = await Test.createTestingModule({
      imports: [TransactionModule],
    })
      .overrideProvider(CreateTransactionUseCase)
      .useValue(mockCreateTransactionUseCase)
      .overrideProvider(FindTransactionByIdUseCase)
      .useValue(mockFindTransactionUseCase)
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
});

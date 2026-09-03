/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AccountModule } from '../../../../domain/account/account.module';
import { CreateAccountUseCase } from '../../../../domain/account/useCase/create-account.use-case';
import { DeleteAccountUseCase } from '../../../../domain/account/useCase/delete-account.use-case';
import { FindAccountByUserIdUseCase } from '../../../../domain/account/useCase/find-account-by-user-id.use-case';
import { UpdateAccountUseCase } from '../../../../domain/account/useCase/update-account.use-case';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth-guard';
import { AuthenticatedRequest } from '../../../../auth/presentation/auth-controller';

describe('AccountController', () => {
  let app: INestApplication;
  const mockCreateAccountUseCase = { execute: jest.fn() };
  const mockFindAccountByUserIdUseCase = { execute: jest.fn() };
  const mockUpdateAccountUseCase = { execute: jest.fn() };
  const mockDeleteAccountUseCase = { execute: jest.fn() };

  beforeAll(async () => {
    const moduleReference = await Test.createTestingModule({
      imports: [AccountModule],
    })
      .overrideProvider(CreateAccountUseCase)
      .useValue(mockCreateAccountUseCase)
      .overrideProvider(FindAccountByUserIdUseCase)
      .useValue(mockFindAccountByUserIdUseCase)
      .overrideProvider(UpdateAccountUseCase)
      .useValue(mockUpdateAccountUseCase)
      .overrideProvider(DeleteAccountUseCase)
      .useValue(mockDeleteAccountUseCase)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
          req.user = {
            id: 'test-user-id',
            email: 'test@email.com',
            googleId: 'test-google-id',
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

  it('should return 201 status with account details', async () => {
    const account = {
      userId: 'test-user-id',
      name: 'My Bank Account',
      currency: 'PHP',
    };

    mockCreateAccountUseCase.execute.mockResolvedValue(account);

    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send(account);

    expect(response.status).toBe(201);
    expect(mockCreateAccountUseCase.execute.mock.calls.length).toBeGreaterThan(
      0,
    );
  });

  it('should throw an error and return 400 when name is empty', async () => {
    const account = {
      userId: 'test-user-id',
      name: '',
      currency: 'PHP',
    };

    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send(account);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('name should not be empty');
  });

  it('should throw an error and return 400 when currency does not belong to choices', async () => {
    const account = {
      userId: 'test-user-id',
      name: 'My Bank Account',
      currency: 'EUR',
    };

    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send(account);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      'currency must be one of the following values: PHP, USD, JPY, SGD',
    );
  });

  it('should return 200 with account details', async () => {
    const account = {
      id: 'test-id',
      userId: 'test-user-id',
      name: 'My Bank Account',
      currency: 'PHP',
    };

    mockFindAccountByUserIdUseCase.execute.mockResolvedValue(account);

    const response = await request(app.getHttpServer()).get('/accounts/me');

    expect(response.status).toBe(200);
    expect(response.body.id).toBe('test-id');
    expect(response.body.userId).toBe('test-user-id');
    expect(response.body.name).toBe('My Bank Account');
    expect(response.body.currency).toBe('PHP');
  });

  it('should return 200 and update existing account', async () => {
    const account = {
      id: 'test-id',
      userId: 'test-user-id',
      name: 'My Bank Account',
      currency: 'PHP',
    };

    mockUpdateAccountUseCase.execute.mockResolvedValue(account);

    await request(app.getHttpServer()).patch('/accounts/test-id').send({
      name: 'Test Name Update',
      currency: 'USD',
    });

    expect(mockUpdateAccountUseCase.execute).toHaveBeenCalledWith({
      id: 'test-id',
      userId: 'test-user-id',
      name: 'Test Name Update',
      currency: 'USD',
    });
  });

  it('should return 400 and throw an error when currency does not belong to choice [PHP, USD, JPY, SGD] ', async () => {
    const account = {
      id: 'test-id',
      userId: 'test-user-id',
      name: 'My Bank Account',
      currency: 'PHP',
    };

    mockUpdateAccountUseCase.execute.mockResolvedValue(account);

    const response = await request(app.getHttpServer())
      .patch('/accounts/test-id')
      .send({
        name: 'Test Name Update',
        currency: 'EUR',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      'currency must be one of the following values: PHP, USD, JPY, SGD',
    );
  });

  it('should return 204 and successfully delete an account when all validation passed', async () => {
    const account = {
      id: 'test-id',
      userId: 'test-user-id',
      name: 'My Bank Account',
      currency: 'PHP',
    };

    mockDeleteAccountUseCase.execute.mockResolvedValue(account);

    const response = await request(app.getHttpServer()).delete(
      '/accounts/test-id',
    );

    expect(response.status).toBe(204);
    expect(mockDeleteAccountUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-id',
        userId: 'test-user-id',
      }),
    );
  });
});

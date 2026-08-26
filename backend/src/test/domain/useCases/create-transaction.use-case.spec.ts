/* eslint-disable @typescript-eslint/unbound-method */
import { CreateTransactionUseCase } from '../../../domain/transaction/useCases/create-transaction.use-case';
import { ITransactionRepository } from '../../../domain/transaction/repository/transaction.repository';

describe('Create Transaction Use Case', () => {
  it('should create a valid transaction using the transaction use case', async () => {
    const repository = {
      save: jest.fn(),
    } as unknown as ITransactionRepository;

    const useCase = new CreateTransactionUseCase(repository);

    await useCase.execute('09817234', 500, 'EXPENSE', '1', 'Lunch', new Date());

    expect(repository.save).toHaveBeenCalled();
  });

  it('should throw an error if the amount is not positive', async () => {
    const repository = {
      save: jest.fn(),
    } as unknown as ITransactionRepository;

    const useCase = new CreateTransactionUseCase(repository);

    await expect(
      useCase.execute('09817234', -200, 'EXPENSE', '1', 'Lunch', new Date()),
    ).rejects.toThrow('Amount must be a positive number');

    expect(repository.save).not.toHaveBeenCalled();
  });

  // -- commented it because Transaction always making a randomUUID in default
  // it('should throw an error if the id is empty', async () => {
  //   const repository = {
  //     save: jest.fn(),
  //   } as unknown as ITransactionRepository;

  //   const useCase = new CreateTransactionUseCase(repository);

  //   await expect(
  //     useCase.execute('', '09817234', 500, 'EXPENSE', '1', 'Lunch', new Date()),
  //   ).rejects.toThrow('Transaction ID cannot be empty');

  //   expect(repository.save).not.toHaveBeenCalled();
  // });

  it('should throw an error if the account id is empty', async () => {
    const repository = {
      save: jest.fn(),
    } as unknown as ITransactionRepository;

    const useCase = new CreateTransactionUseCase(repository);

    await expect(
      useCase.execute('', 500, 'EXPENSE', '1', 'Lunch', new Date()),
    ).rejects.toThrow('Account ID cannot be empty');

    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should throw an error if the category id is empty', async () => {
    const repository = {
      save: jest.fn(),
    } as unknown as ITransactionRepository;

    const useCase = new CreateTransactionUseCase(repository);

    await expect(
      useCase.execute('12334', 500, 'EXPENSE', '', 'Lunch', new Date()),
    ).rejects.toThrow('Category ID cannot be empty');

    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should throw an error if the Description is empty', async () => {
    const repository = {
      save: jest.fn(),
    } as unknown as ITransactionRepository;

    const useCase = new CreateTransactionUseCase(repository);

    await expect(
      useCase.execute('45123', 500, 'EXPENSE', '2', '', new Date()),
    ).rejects.toThrow('Description cannot be empty');

    expect(repository.save).not.toHaveBeenCalled();
  });
});

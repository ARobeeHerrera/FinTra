/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Transaction } from '../../../../domain/transaction/domain/entity/transaction.entity';

describe('Transaction Domain', () => {
  it('should create the valid transaction when all props are valid', () => {
    const transaction = Transaction.create({
      id: '12345',
      accountId: '0981234',
      userId: '0981234',
      amount: 100,
      type: 'EXPENSE',
      categoryId: '2',
      description: 'Food',
      date: new Date(),
    });

    expect(transaction).toBeDefined();
    expect(transaction.getId()).toBe('12345');
    expect(transaction.getAccountId()).toBe('0981234');
    expect(transaction.getAmount()).toBe(100);
    expect(transaction.getType()).toBe('EXPENSE');
    expect(transaction.getCategoryId()).toBe('2');
    expect(transaction.getDescription()).toBe('Food');
    expect(transaction.getDate()).toBeInstanceOf(Date);
  });

  it('should throw an error when the amount is negative', () => {
    expect(() => {
      Transaction.create({
        id: '12345',
        accountId: '0981234',
        userId: '0981234',
        amount: -100,
        type: 'EXPENSE',
        categoryId: '2',
        description: 'Food',
        date: new Date(),
      });
    }).toThrow('Amount must be a positive number');
  });

  it('should throw an error when the amount equal to zero', () => {
    expect(() => {
      Transaction.create({
        id: '12345',
        accountId: '0981234',
        userId: '0981234',
        amount: 0,
        type: 'EXPENSE',
        categoryId: '2',
        description: 'Food',
        date: new Date(),
      });
    }).toThrow('Amount must be a positive number');
  });

  it('should throw an error when the type is invalid', () => {
    expect(() => {
      Transaction.create({
        id: '12345',
        accountId: '0981234',
        userId: '0981234',
        amount: 100,
        type: 'Expense' as any,
        categoryId: '2',
        description: 'Food',
        date: new Date(),
      });
    }).toThrow('Type must be either INCOME or EXPENSE');
  });

  it('should throw an error when id is empty', () => {
    expect(() => {
      Transaction.create({
        id: '',
        accountId: '0981234',
        userId: '0981234',
        amount: 100,
        type: 'EXPENSE',
        categoryId: '2',
        description: 'Food',
        date: new Date(),
      });
    }).toThrow('Transaction ID cannot be empty');
  });

  it('should throw an error when accountId is empty', () => {
    expect(() => {
      Transaction.create({
        id: '12345',
        accountId: '',
        userId: '0981234',
        amount: 100,
        type: 'EXPENSE',
        categoryId: '2',
        description: 'Food',
        date: new Date(),
      });
    }).toThrow('Account ID cannot be empty');
  });

  it('should throw an error when categoryId is empty', () => {
    expect(() => {
      Transaction.create({
        id: '12345',
        accountId: '0981234',
        userId: '0981234',
        amount: 100,
        type: 'EXPENSE',
        categoryId: '',
        description: 'Food',
        date: new Date(),
      });
    }).toThrow('Category ID cannot be empty');
  });

  it('should throw an error when description is empty', () => {
    expect(() => {
      Transaction.create({
        id: '12345',
        accountId: '0981234',
        userId: '0981234',
        amount: 100,
        type: 'EXPENSE',
        categoryId: '2',
        description: '',
        date: new Date(),
      });
    }).toThrow('Description cannot be empty');
  });

  it('should throw an error when invalid date is provided', () => {
    expect(() => {
      Transaction.create({
        id: '12345',
        accountId: '0981234',
        userId: '0981234',
        amount: 100,
        type: 'EXPENSE',
        categoryId: '2',
        description: 'Food',
        date: '2023-01-01' as any,
      });
    }).toThrow('Invalid Date');
  });

  it('should update the amount of the created transaction', () => {
    const transaction = Transaction.create({
      id: '12345',
      accountId: '0981234',
      userId: '0981234',
      amount: 100,
      type: 'EXPENSE',
      categoryId: '2',
      description: 'Food',
      date: new Date(),
    });

    transaction.updateAmount(200);

    expect(transaction.getAmount()).toBe(200);
  });

  it('should update the amount of the created transaction', () => {
    const transaction = Transaction.create({
      id: '12345',
      accountId: '0981234',
      userId: '0981234',
      amount: 100,
      type: 'EXPENSE',
      categoryId: '2',
      description: 'Food',
      date: new Date(),
    });

    transaction.updateDescription('Groceries');

    expect(transaction.getDescription()).toBe('Groceries');
  });
});

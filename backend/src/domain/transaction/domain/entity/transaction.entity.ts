import { Guard } from '../../../../shared/domain/guards/guard';

export type TransactionType = 'INCOME' | 'EXPENSE';

export class Transaction {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly accountId: string,
    private amount: number,
    private type: 'INCOME' | 'EXPENSE',
    private categoryId: string,
    private description: string,
    private readonly date: Date,
  ) {}
  static create(props: {
    id: string;
    userId: string;
    accountId: string;
    amount: number;
    type: TransactionType;
    categoryId: string;
    description: string;
    date: Date;
  }): Transaction {
    Guard.againstEmptyString(props.id, 'Transaction ID cannot be empty');
    Guard.againstEmptyString(props.accountId, 'Account ID cannot be empty');
    Guard.againstNonPositive(props.amount, 'Amount must be a positive number');
    Guard.againstOutOfRange(
      props.type,
      ['INCOME', 'EXPENSE'],
      'Type must be either INCOME or EXPENSE',
    );
    Guard.againstEmptyString(props.categoryId, 'Category ID cannot be empty');
    Guard.againstEmptyString(props.description, 'Description cannot be empty');
    Guard.againstEmptyString(props.userId, 'User ID cannot be empty');
    Guard.againstInvalidDate(props.date, 'Invalid Date');

    return new Transaction(
      props.id,
      props.userId,
      props.accountId,
      props.amount,
      props.type,
      props.categoryId,
      props.description,
      props.date,
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getAccountId(): string {
    return this.accountId;
  }

  getAmount(): number {
    return this.amount;
  }

  getType(): TransactionType {
    return this.type;
  }

  getCategoryId(): string {
    return this.categoryId;
  }

  getDescription(): string {
    return this.description;
  }

  getDate(): Date {
    return this.date;
  }

  // Behavior
  updateAmount(newAmount: number): void {
    Guard.againstNonPositive(newAmount, 'Amount must be a positive number');
    this.amount = newAmount;
  }

  updateDescription(newDescription: string): void {
    Guard.againstEmptyString(newDescription, 'Description must not be empty');
    this.description = newDescription;
  }

  updateCategoryId(newCategoryId: string): void {
    Guard.againstEmptyString(newCategoryId, 'Category ID must not be empty');
    this.categoryId = newCategoryId;
  }

  updateType(newType: TransactionType): void {
    Guard.againstOutOfRange(
      newType,
      ['INCOME', 'EXPENSE'],
      `${newType} does not belong to either INCOME and EXPENSE`,
    );
    this.type = newType;
  }
}

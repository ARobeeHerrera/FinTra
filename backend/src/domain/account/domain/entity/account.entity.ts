import { Guard } from '../../../../shared/domain/guards/guard';

type AccountParams = {
  id: string;
  userId: string;
  name: string;
  currency: CurrencyType;
};

export type CurrencyType = 'PHP' | 'USD' | 'JPY' | 'SGD';

export class Account {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private name: string,
    private currency: CurrencyType,
  ) {}

  static create(params: AccountParams): Account {
    Guard.againstEmptyString(params.id, 'Account Id cannot be empty');
    Guard.againstEmptyString(params.userId, 'User Id cannot be empty');
    Guard.againstEmptyString(params.name, 'Name cannot be empty');
    Guard.againstOutOfRange(
      params.currency,
      ['PHP', 'USD', 'JPY', 'SGD'],
      'Currency must be PHP, USD, JPY, OR SGD',
    );

    return new Account(params.id, params.userId, params.name, params.currency);
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getName(): string {
    return this.name;
  }

  getCurrency(): CurrencyType {
    return this.currency;
  }

  updateName(newName: string): void {
    Guard.againstEmptyString(newName, 'Name cannot be empty');
    this.name = newName;
  }

  updateCurrency(newCurrency: CurrencyType): void {
    Guard.againstOutOfRange(
      newCurrency,
      ['PHP', 'USD', 'JPY', 'SGD'],
      'Currency must be PHP, USD, JPY, OR SGD',
    );

    this.currency = newCurrency;
  }
}

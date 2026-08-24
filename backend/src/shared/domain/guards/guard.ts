export class Guard {
  static againstNonPositive(value: number, message: string): void {
    if (value <= 0) {
      throw new Error(message);
    }
  }

  static againstNullOrUndefined(value: any, message: string): void {
    if (value === null || value === undefined) {
      throw new Error(message);
    }
  }

  static againstEmptyString(value: string, message: string): void {
    if (value.trim() === '') {
      throw new Error(message);
    }
  }

  static againstInvalidDate(value: Date, message: string): void {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error(message);
    }
  }

  static againstOutOfRange<T>(value: T, allowed: T[], message: string): void {
    if (!allowed.includes(value)) {
      throw new Error(message);
    }
  }
}

import { format } from 'date-fns';

export class OperationDate {
  private constructor(private readonly _value: Date) {}

  private static isOperationInFuture(operationDate: Date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const operationDateStart = new Date(
      operationDate.getFullYear(),
      operationDate.getMonth(),
      operationDate.getDate(),
    );
    return operationDateStart.getTime() > today.getTime();
  }

  private static parseDate(operationDate: string | Date): Date {
    if (typeof operationDate === 'string') {
      return new Date(operationDate);
    }

    if (operationDate instanceof Date) {
      return operationDate;
    }

    throw new Error('Invalid operation date');
  }

  private static isValidDate(date: Date): boolean {
    return !isNaN(date.getTime());
  }

  private static validateOperationDate(operationDate: string | Date): Date {
    const date = this.parseDate(operationDate);

    if (!this.isValidDate(date)) {
      throw new Error('Invalid operation date');
    }

    if (this.isOperationInFuture(date)) {
      throw new Error('Operation date cannot be in the future');
    }

    return date;
  }

  static create(operationDate: string | Date) {
    operationDate = this.validateOperationDate(operationDate);
    return new OperationDate(operationDate);
  }

  getValue(): Date {
    return this._value;
  }

  toString(): string {
    return format(this._value, 'yyyy-MM-dd');
  }

  isBefore(operationDate: OperationDate): boolean {
    return this._value < operationDate.getValue();
  }

  isAfter(operationDate: OperationDate): boolean {
    return this._value > operationDate.getValue();
  }

  isSameDay(operationDate: OperationDate): boolean {
    const operationDateValue = operationDate.getValue();
    return (
      this._value.getFullYear() === operationDateValue.getFullYear() &&
      this._value.getMonth() === operationDateValue.getMonth() &&
      this._value.getDate() === operationDateValue.getDate()
    );
  }

  isBeforeOrEqual(operationDate: OperationDate): boolean {
    return this._value <= operationDate.getValue();
  }

  isAfterOrEqual(operationDate: OperationDate): boolean {
    return this._value >= operationDate.getValue();
  }

  isBetween(
    start: OperationDate,
    end: OperationDate,
    inclusive = false,
  ): boolean {
    const time = this._value.getTime();
    const startTime = start.getValue().getTime();
    const endTime = end.getValue().getTime();

    if (inclusive) {
      return time >= startTime && time <= endTime;
    }
    return time > startTime && time < endTime;
  }

  compare(other: OperationDate): number {
    return this._value.getTime() - other.getValue().getTime();
  }
}

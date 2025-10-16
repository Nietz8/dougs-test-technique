import { Amount } from '../amount/amount.vo';
import { OperationDate } from '../operation-date/operation-date.vo';

export class StatementBalance {
  private constructor(
    private readonly _date: OperationDate,
    private readonly _balance: Amount,
  ) {}

  private static validate(date: OperationDate, balance: Amount) {
    if (!date || !balance) {
      throw new Error('StatementBalance requires both date and balance');
    }
    if (!(date instanceof OperationDate)) {
      throw new Error('date must be an OperationDate instance');
    }
    if (!(balance instanceof Amount)) {
      throw new Error('balance must be an Amount instance');
    }
  }

  static create(props: {
    date: OperationDate;
    balance: Amount;
  }): StatementBalance {
    this.validate(props.date, props.balance);
    return new StatementBalance(props.date, props.balance);
  }

  equals(other: StatementBalance): boolean {
    return (
      this._date.isSameDay(other._date) && this._balance.equals(other._balance)
    );
  }

  isBefore(other: StatementBalance): boolean {
    return this._date.isBefore(other._date);
  }

  isAfter(other: StatementBalance): boolean {
    return this._date.isAfter(other._date);
  }

  balanceDifference(other: StatementBalance): Amount {
    return this._balance.subtract(other._balance);
  }

  toString(): string {
    return `${this._date.toString()} | ${this._balance.toString()}`;
  }

  getDate(): OperationDate {
    return this._date;
  }

  getBalance(): Amount {
    return this._balance;
  }
}

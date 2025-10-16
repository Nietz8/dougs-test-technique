import { Amount } from '../../value-objects/amount/amount.vo';
import { OperationDate } from '../../value-objects/operation-date/operation-date.vo';
import { Wording } from '../../value-objects/wording/wording.vo';

export class BankOperation {
  private readonly id: number;
  private readonly date: OperationDate;
  private readonly wording: Wording;
  private readonly amount: Amount;

  private constructor(props: {
    id: number;
    date: OperationDate;
    wording: Wording;
    amount: Amount;
  }) {
    this.id = props.id;
    this.date = props.date;
    this.wording = props.wording;
    this.amount = props.amount;
  }

  private static validate(props: {
    id: number;
    date: OperationDate;
    wording: Wording;
    amount: Amount;
  }) {
    if (props.id === undefined || props.id === null) {
      throw new Error('Bank operation Id is required.');
    }

    if (isNaN(props.id)) {
      throw new Error('Bank operation Id must be a number.');
    }

    if (!props.date || !props.wording || !props.amount) {
      throw new Error(
        'Invalid bank operation input: date, wording and amount are required.',
      );
    }

    if (typeof props.id !== 'number') {
      throw new Error('Bank operation Id must be a number.');
    }

    if (!(props.date instanceof OperationDate)) {
      throw new Error(
        'Bank operation date must be an instance of OperationDate.',
      );
    }

    if (!(props.wording instanceof Wording)) {
      throw new Error('Bank operation wording must be an instance of Wording.');
    }

    if (!(props.amount instanceof Amount)) {
      throw new Error('Bank operation amount must be an instance of Amount.');
    }
  }

  static create(props: {
    id: number;
    date: OperationDate;
    wording: Wording;
    amount: Amount;
  }): BankOperation {
    this.validate(props);
    return new BankOperation(props);
  }

  hasSameId(other: BankOperation): boolean {
    return this.id === other.getId();
  }

  hasSameValueAs(other: BankOperation): boolean {
    return (
      this.date.isSameDay(other.date) &&
      this.wording.equals(other.wording) &&
      this.amount.equals(other.amount)
    );
  }

  isSameDayAs(other: BankOperation): boolean {
    return this.date.isSameDay(other.date);
  }

  toString(): string {
    return `${this.getId()} | ${this.date.toString()} | ${this.wording.toString()} | ${this.amount.toString()}`;
  }

  getId(): number {
    return this.id;
  }

  getDate(): OperationDate {
    return this.date;
  }

  getWording(): Wording {
    return this.wording;
  }

  getAmount(): Amount {
    return this.amount;
  }
}

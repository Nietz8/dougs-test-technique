import { Amount } from '../amount/amount.vo';
import { OperationDate } from '../operation-date/operation-date.vo';
import { StatementBalance } from './statement-balance.vo';

describe('StatementBalance (Value Object)', () => {
  describe('Creation & Validation', () => {
    it('should create a valid StatementBalance with date and balance', () => {
      const date = OperationDate.create('2025-03-31');
      const balance = Amount.create(2450.5);
      const statement = StatementBalance.create({ date, balance });

      expect(statement).toBeInstanceOf(StatementBalance);
      expect(statement.toString()).toBe('2025-03-31 | 2450.50');
    });

    it('should throw if date or balance is missing', () => {
      const date = OperationDate.create('2025-03-31');

      // @ts-expect-error  - invalid input
      expect(() => StatementBalance.create({ date })).toThrow(
        'StatementBalance requires both date and balance',
      );
      // @ts-expect-error  - invalid input
      expect(() => StatementBalance.create({ balance: null })).toThrow(
        'StatementBalance requires both date and balance',
      );
    });

    it('should reject invalid date instance', () => {
      const balance = Amount.create(1000);

      expect(() =>
        StatementBalance.create({
          // @ts-expect-error  - invalid input
          date: '2025-03-31',
          balance,
        }),
      ).toThrow();
    });

    it('should reject invalid balance instance', () => {
      const date = OperationDate.create('2025-03-31');

      expect(() =>
        StatementBalance.create({
          date,
          // @ts-expect-error  - invalid input
          balance: 1000,
        }),
      ).toThrow();
    });

    it('should reject null/undefined props', () => {
      expect(() => StatementBalance.create(null as any)).toThrow();
      expect(() => StatementBalance.create(undefined as any)).toThrow();
      expect(() => StatementBalance.create({} as any)).toThrow();
    });
  });

  describe('Comparison logic', () => {
    const statement1 = StatementBalance.create({
      date: OperationDate.create('2025-03-31'),
      balance: Amount.create(2450.5),
    });

    const statement2 = StatementBalance.create({
      date: OperationDate.create('2025-04-30'),
      balance: Amount.create(2600.75),
    });

    const statement3 = StatementBalance.create({
      date: OperationDate.create('2025-03-31'),
      balance: Amount.create(2450.5),
    });

    it('should compare equality based on date and balance', () => {
      expect(statement1.equals(statement3)).toBe(true);
      expect(statement1.equals(statement2)).toBe(false);
    });

    it('should determine chronological order', () => {
      expect(statement1.isBefore(statement2)).toBe(true);
      expect(statement2.isAfter(statement1)).toBe(true);
      expect(statement1.isAfter(statement3)).toBe(false);
    });

    it('should calculate balance difference between statements', () => {
      const diff = statement2.balanceDifference(statement1);
      expect(diff.getValue()).toBe(150.25);
    });
  });

  describe('String representation', () => {
    it('should produce a stable and readable string', () => {
      const statement = StatementBalance.create({
        date: OperationDate.create('2025-06-30'),
        balance: Amount.create(5000),
      });
      expect(statement.toString()).toBe('2025-06-30 | 5000.00');
    });
  });
});

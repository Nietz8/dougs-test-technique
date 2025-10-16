import { Amount } from '../../value-objects/amount/amount.vo';
import { OperationDate } from '../../value-objects/operation-date/operation-date.vo';
import { Wording } from '../../value-objects/wording/wording.vo';
import { BankOperation } from './bank-operation.entity';

describe('BankOperation (Entity)', () => {
  describe('Creation & Validation', () => {
    it('should create a valid BankOperation with all properties', () => {
      const operation = BankOperation.create({
        id: 1,
        date: OperationDate.create('2025-03-10'),
        wording: Wording.create('VIREMENT SALAIRE'),
        amount: Amount.create(2100),
      });

      expect(operation).toBeInstanceOf(BankOperation);
      expect(operation.getId()).toBe(1);
      expect(operation.getDate().toString()).toBe('2025-03-10');
      expect(operation.getWording().toString()).toBe('VIREMENT SALAIRE');
      expect(operation.getAmount().getValue()).toBe(2100);
    });

    it('should reject NaN as ID', () => {
      expect(() =>
        BankOperation.create({
          id: NaN,
          date: OperationDate.create('2025-03-10'),
          wording: Wording.create('TEST'),
          amount: Amount.create(100),
        }),
      ).toThrow();
    });

    it('should reject invalid date instance', () => {
      expect(() =>
        BankOperation.create({
          id: 1,
          // @ts-expect-error invalid date
          date: '2025-03-10',
          wording: Wording.create('TEST'),
          amount: Amount.create(100),
        }),
      ).toThrow('Bank operation date must be an instance of OperationDate');
    });

    it('should reject invalid wording instance', () => {
      expect(() =>
        BankOperation.create({
          id: 1,
          date: OperationDate.create('2025-03-10'),
          // @ts-expect-error invalid wording
          wording: 'TEST',
          amount: Amount.create(100),
        }),
      ).toThrow('Bank operation wording must be an instance of Wording');
    });

    it('should reject invalid amount instance', () => {
      expect(() =>
        BankOperation.create({
          id: 1,
          date: OperationDate.create('2025-03-10'),
          wording: Wording.create('TEST'),
          // @ts-expect-error invalid amount
          amount: 100,
        }),
      ).toThrow('Bank operation amount must be an instance of Amount');
    });

    it('should reject null/undefined props', () => {
      expect(() => BankOperation.create(null as any)).toThrow();
      expect(() => BankOperation.create(undefined as any)).toThrow();
    });
  });

  describe('Behavior', () => {
    const operation1 = BankOperation.create({
      id: 1,
      date: OperationDate.create('2025-03-05'),
      wording: Wording.create('CARTE SUPERMARCHE PARIS'),
      amount: Amount.create(-54.9),
    });

    const operation2 = BankOperation.create({
      id: 2,
      date: OperationDate.create('2025-03-05'),
      wording: Wording.create('CARTE SUPERMARCHE PARIS'),
      amount: Amount.create(-54.9),
    });

    const operation3 = BankOperation.create({
      id: 3,
      date: OperationDate.create('2025-03-06'),
      wording: Wording.create('PRLV EDF'),
      amount: Amount.create(-125.5),
    });

    it('should detect equality based on date, wording, and amount (not ID)', () => {
      expect(operation1.hasSameValueAs(operation2)).toBe(true);
      expect(operation1.hasSameValueAs(operation3)).toBe(false);
    });

    it('should compare same-day movements', () => {
      expect(operation1.isSameDayAs(operation2)).toBe(true);
      expect(operation1.isSameDayAs(operation3)).toBe(false);
    });

    it('should produce a readable string representation', () => {
      const str = operation1.toString();
      expect(str).toContain('2025-03-05');
      expect(str).toContain('CARTE SUPERMARCHE PARIS');
      expect(str).toContain('-54.90');
    });
  });
});

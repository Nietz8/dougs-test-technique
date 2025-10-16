import { Amount } from './amount.vo';

describe('Amount value-object', () => {
  describe('Amount creation', () => {
    it('should create a valid Amount instance', () => {
      const expectedAmount = 125.75;

      const amount = Amount.create(expectedAmount);

      expect(amount).toBeInstanceOf(Amount);
      expect(amount.getValue()).toEqual(expectedAmount);
    });

    it('should throw an error if the value is not a number', () => {
      expect(() => Amount.create(NaN)).toThrow('Amount must be a valid number');
    });
  });

  describe('Add amounts', () => {
    it('should add one amount with another and return a new immutable instance', () => {
      const amount1 = Amount.create(150);
      const amount2 = Amount.create(175);
      const expectedAddResult = 325;

      const result = amount1.add(amount2);

      expect(amount1.getValue()).toEqual(150);
      expect(amount2.getValue()).toEqual(175);
      expect(result).toBeInstanceOf(Amount);
      expect(result.getValue()).toEqual(expectedAddResult);
    });

    it('should add negative amounts correctly', () => {
      const amount1 = Amount.create(-100.5);
      const amount2 = Amount.create(200.75);
      const expectedAddResult = 100.25;

      const result = amount1.add(amount2);

      expect(result.getValue()).toBe(expectedAddResult);
    });

    it('should preserve decimal precision when adding', () => {
      const amount1 = Amount.create(0.2);
      const amount2 = Amount.create(0.1);
      const expectedAddResult = 0.3;

      const result = amount1.add(amount2);

      expect(result.getValue()).toEqual(expectedAddResult);
    });

    it('should handle very small amounts (cents)', () => {
      const cent1 = Amount.create(0.01);
      const cent2 = Amount.create(0.02);
      const expectedAddResult = 0.03;

      const result = cent1.add(cent2);

      expect(result.getValue()).toBe(expectedAddResult);
    });
  });

  describe('Subtract Amounts', () => {
    it('should subtract one Amount from another and return a new immutable instance', () => {
      const amount1 = Amount.create(200);
      const amount2 = Amount.create(100);
      const expectedSubtractResult = 100;

      const result = amount1.subtract(amount2);

      expect(amount1.getValue()).toBe(200);
      expect(amount2.getValue()).toBe(100);
      expect(result).toBeInstanceOf(Amount);
      expect(result.getValue()).toBe(expectedSubtractResult);
    });

    it('should subtract negative amounts (double negative)', () => {
      const amount1 = Amount.create(-200);
      const amount2 = Amount.create(100);
      const expectedSubtractResult = -300;

      const result = amount1.subtract(amount2);

      expect(result.getValue()).toBe(expectedSubtractResult);
    });

    it('should preserve decimal precision when subtracting', () => {
      const amount1 = Amount.create(0.25);
      const amount2 = Amount.create(0.1);
      const expectedSubtractResult = 0.15;

      const result = amount1.subtract(amount2);

      expect(result.getValue()).toEqual(expectedSubtractResult);
    });
  });

  describe('Amount values comparison', () => {
    it('should return true for exactly equals Amount values', () => {
      const amount1 = Amount.create(3650);
      const amount2 = Amount.create(3650);

      expect(amount1.equals(amount2)).toBe(true);
    });

    it('should return false for differents Amount values', () => {
      const amount1 = Amount.create(3650);
      const amount2 = Amount.create(5660);

      expect(amount1.equals(amount2)).toBe(false);
    });

    it('should handle symetric comparison', () => {
      const amount1 = Amount.create(5000);
      const amount2 = Amount.create(5000);

      expect(amount1.equals(amount2)).toBe(amount2.equals(amount1));
    });

    it('should handle negative amount correctly', () => {
      const amount1 = Amount.create(-12500);
      const amount2 = Amount.create(-12500);

      expect(amount1.equals(amount2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return a string with exactly two decimal places for positive amounts', () => {
      const amount = Amount.create(175.2);

      expect(amount.toString()).toStrictEqual('175.20');
    });

    it('should return a string with exactly two decimal places for negative amounts', () => {
      const amount = Amount.create(-452.1);

      expect(amount.toString()).toStrictEqual('-452.10');
    });

    it('should return decimal precision', () => {
      const amount = Amount.create(0.23);

      expect(amount.toString()).toStrictEqual('0.23');
    });

    it('should return "0.00" for zero value', () => {
      const amount = Amount.create(0);

      expect(amount.toString()).toStrictEqual('0.00');
    });
  });
});

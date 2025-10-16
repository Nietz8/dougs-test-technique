import { OperationDate } from './operation-date.vo';

describe('Opération-Date value-object', () => {
  describe('Creation & validation', () => {
    it('should create a valid OperationDate from valid string', () => {
      const operationDate = OperationDate.create('2025-02-20');

      expect(operationDate).toBeInstanceOf(OperationDate);
    });

    it('should create a valid OperationDate from valid date', () => {
      const operationDate = OperationDate.create(new Date('2025-02-20'));

      expect(operationDate).toBeInstanceOf(OperationDate);
    });

    it('should throw an error for invalid date strings', () => {
      expect(() => OperationDate.create('not-a-date')).toThrow(
        'Invalid operation date',
      );
    });

    it('should throw an error for future dates', () => {
      const future = new Date();
      future.setDate(future.getDate() + 5);

      expect(() => OperationDate.create(future)).toThrow(
        'Operation date cannot be in the future',
      );
    });
  });

  describe('GetValue', () => {
    it('should return the date value in Date format', () => {
      const dateValue = '2025-03-21';
      const operationDate = OperationDate.create(dateValue);

      expect(operationDate.getValue()).toBeInstanceOf(Date);
      expect(operationDate.getValue()).toEqual(new Date(dateValue));
    });
  });

  describe('String representation', () => {
    it('should return a string formatted as YYYY-MM-DD', () => {
      const operationDate = OperationDate.create('2025-06-30');
      expect(operationDate.toString()).toBe('2025-06-30');
    });
  });

  describe('Comparison dates : isBefore, isAfter, isSameDay', () => {
    const operationDate1st = OperationDate.create('2025-03-01');
    const operationDateSame1st = OperationDate.create('2025-03-01');
    const operationDate15th = OperationDate.create('2025-03-15');

    it('should correctly identify if one date is before another', () => {
      expect(operationDate1st.isBefore(operationDate15th)).toBe(true);
      expect(operationDate15th.isBefore(operationDate1st)).toBe(false);
    });

    it('should correctly identify if one date is after another', () => {
      expect(operationDate15th.isAfter(operationDate1st)).toBe(true);
      expect(operationDate1st.isAfter(operationDate15th)).toBe(false);
    });

    it('should correctly identify if two dates are the same day', () => {
      expect(operationDate1st.isSameDay(operationDateSame1st)).toBe(true);
      expect(operationDate1st.isSameDay(operationDate15th)).toBe(false);
    });
  });

  describe('compare()', () => {
    it('should return a negative number if this date is before the other', () => {
      const d1 = OperationDate.create('2025-03-01');
      const d2 = OperationDate.create('2025-03-05');

      expect(d1.compare(d2)).toBeLessThan(0);
    });

    it('should return a positive number if this date is after the other', () => {
      const d1 = OperationDate.create('2025-03-10');
      const d2 = OperationDate.create('2025-03-05');

      expect(d1.compare(d2)).toBeGreaterThan(0);
    });

    it('should return 0 if both dates are the same day', () => {
      const d1 = OperationDate.create('2025-03-10');
      const d2 = OperationDate.create('2025-03-10');

      expect(d1.compare(d2)).toBe(0);
    });

    it('should be consistent with isBefore() and isAfter()', () => {
      const d1 = OperationDate.create('2025-03-01');
      const d2 = OperationDate.create('2025-03-05');

      const cmp = d1.compare(d2);
      expect(cmp < 0).toBe(d1.isBefore(d2));
      expect(cmp > 0).toBe(d1.isAfter(d2));
    });

    it('should allow sorting of OperationDate instances', () => {
      const dates = [
        OperationDate.create('2025-03-10'),
        OperationDate.create('2025-03-01'),
        OperationDate.create('2025-03-05'),
      ];

      const sorted = dates.sort((a, b) => a.compare(b));

      expect(sorted.map((d) => d.toString())).toEqual([
        '2025-03-01',
        '2025-03-05',
        '2025-03-10',
      ]);
    });
  });

  describe('isBetween()', () => {
    const start = OperationDate.create('2025-03-01');
    const end = OperationDate.create('2025-03-31');

    it('should return true for a date strictly between two others', () => {
      const mid = OperationDate.create('2025-03-15');
      expect(mid.isBetween(start, end)).toBe(true);
    });

    it('should return false for a date before the start', () => {
      const before = OperationDate.create('2025-02-28');
      expect(before.isBetween(start, end)).toBe(false);
    });

    it('should return false for a date after the end', () => {
      const after = OperationDate.create('2025-04-01');
      expect(after.isBetween(start, end)).toBe(false);
    });

    it('should include bounds if inclusive=true', () => {
      expect(start.isBetween(start, end, true)).toBe(true);
      expect(end.isBetween(start, end, true)).toBe(true);
    });

    it('should exclude bounds if inclusive=false', () => {
      expect(start.isBetween(start, end, false)).toBe(false);
      expect(end.isBetween(start, end, false)).toBe(false);
    });
  });
});

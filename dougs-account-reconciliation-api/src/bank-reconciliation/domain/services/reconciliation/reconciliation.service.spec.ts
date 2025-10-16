import { ReconciliationService } from './reconciliation.service';
import { BankOperation } from '../../entities/bank-operation/bank-operation.entity';
import { StatementBalance } from '../../value-objects/statement-balance/statement-balance.vo';
import { Amount } from '../../value-objects/amount/amount.vo';
import { OperationDate } from '../../value-objects/operation-date/operation-date.vo';
import { Wording } from '../../value-objects/wording/wording.vo';
import { REASON_MESSAGE, REASON_CODE } from '../../types/reason.type';

describe('ReconciliationService', () => {
  describe('sync', () => {
    it('should return ACCEPTED when operations match statement balance variation', () => {
      const startDate = OperationDate.create(new Date('2024-01-01'));
      const endDate = OperationDate.create(new Date('2024-01-31'));

      const statements = [
        StatementBalance.create({
          date: startDate,
          balance: Amount.create(1000),
        }),
        StatementBalance.create({
          date: endDate,
          balance: Amount.create(1500),
        }),
      ];

      const operation = BankOperation.create({
        id: 1,
        date: OperationDate.create(new Date('2024-01-15')),
        wording: Wording.create('VENTE'),
        amount: Amount.create(500),
      });

      const result = ReconciliationService.sync({
        operations: [operation],
        statements,
      });

      expect(result).toHaveLength(1);
      expect(result[0].message).toBe(REASON_MESSAGE.ACCEPTED);
      expect(result[0].period.startDate).toEqual(startDate);
      expect(result[0].period.endDate).toEqual(endDate);
    });

    it('should return VALIDATION_FAILED with DUPLICATED_OPERATIONS when duplicates found', () => {
      const startDate = OperationDate.create(new Date('2024-01-01'));
      const endDate = OperationDate.create(new Date('2024-01-31'));

      const statements = [
        StatementBalance.create({
          date: startDate,
          balance: Amount.create(1000),
        }),
        StatementBalance.create({
          date: endDate,
          balance: Amount.create(1250),
        }),
      ];

      const operation1 = BankOperation.create({
        id: 1,
        date: OperationDate.create(new Date('2024-01-15')),
        wording: Wording.create('VENTE'),
        amount: Amount.create(100),
      });

      const operation2 = BankOperation.create({
        id: 1,
        date: OperationDate.create(new Date('2024-01-15')),
        wording: Wording.create('VENTE'),
        amount: Amount.create(100),
      });

      const operation3 = BankOperation.create({
        id: 2,
        date: OperationDate.create(new Date('2024-01-15')),
        wording: Wording.create('ACHAT'),
        amount: Amount.create(50),
      });

      const operation4 = BankOperation.create({
        id: 2,
        date: OperationDate.create(new Date('2024-01-15')),
        wording: Wording.create('ACHAT'),
        amount: Amount.create(50),
      });

      const result = ReconciliationService.sync({
        operations: [operation1, operation2, operation3, operation4],
        statements,
      });

      expect(result).toHaveLength(1);
      expect(result[0].message).toBe(REASON_MESSAGE.VALIDATION_FAILED);
      expect(result[0].code).toBe(REASON_CODE.DUPLICATED_OPERATIONS);
      expect(result[0].duplicatedIds).toEqual([1, 2]);
    });

    it('should return VALIDATION_FAILED with MISSING_OPERATION when balance mismatch', () => {
      const startDate = OperationDate.create(new Date('2024-01-01'));
      const endDate = OperationDate.create(new Date('2024-01-31'));

      const statements = [
        StatementBalance.create({
          date: startDate,
          balance: Amount.create(1000),
        }),
        StatementBalance.create({
          date: endDate,
          balance: Amount.create(1500),
        }),
      ];

      const operation = BankOperation.create({
        id: 1,
        date: OperationDate.create(new Date('2024-01-15')),
        wording: Wording.create('VENTE'),
        amount: Amount.create(300),
      });

      const result = ReconciliationService.sync({
        operations: [operation],
        statements,
      });

      expect(result).toHaveLength(1);
      expect(result[0].message).toBe(REASON_MESSAGE.VALIDATION_FAILED);
      expect(result[0].code).toBe(REASON_CODE.MISSING_OPERATION);
      expect(result[0].gap).toBeDefined();
      expect(result[0].gap?.getValue()).toBe(200);
    });

    it('should handle multiple periods correctly', () => {
      const date1 = OperationDate.create(new Date('2024-01-01'));
      const date2 = OperationDate.create(new Date('2024-01-15'));
      const date3 = OperationDate.create(new Date('2024-01-31'));

      const statements = [
        StatementBalance.create({ date: date1, balance: Amount.create(1000) }),
        StatementBalance.create({ date: date2, balance: Amount.create(1200) }),
        StatementBalance.create({ date: date3, balance: Amount.create(1500) }),
      ];

      const operation1 = BankOperation.create({
        id: 1,
        date: OperationDate.create(new Date('2024-01-10')),
        wording: Wording.create('VENTE 1'),
        amount: Amount.create(200),
      });

      const operation2 = BankOperation.create({
        id: 2,
        date: OperationDate.create(new Date('2024-01-20')),
        wording: Wording.create('VENTE 2'),
        amount: Amount.create(300),
      });

      const result = ReconciliationService.sync({
        operations: [operation1, operation2],
        statements,
      });

      expect(result).toHaveLength(2);
      expect(result[0].message).toBe(REASON_MESSAGE.ACCEPTED);
      expect(result[1].message).toBe(REASON_MESSAGE.ACCEPTED);
    });

    it('should sort operations and statements by date', () => {
      const date1 = OperationDate.create(new Date('2024-01-01'));
      const date2 = OperationDate.create(new Date('2024-01-31'));

      const statements = [
        StatementBalance.create({ date: date2, balance: Amount.create(1500) }),
        StatementBalance.create({ date: date1, balance: Amount.create(1000) }),
      ];

      const operation = BankOperation.create({
        id: 1,
        date: OperationDate.create(new Date('2024-01-15')),
        wording: Wording.create('VENTE'),
        amount: Amount.create(500),
      });

      const result = ReconciliationService.sync({
        operations: [operation],
        statements,
      });

      expect(result).toHaveLength(1);
      expect(result[0].message).toBe(REASON_MESSAGE.ACCEPTED);
    });

    it('should exclude operations at start date boundary', () => {
      const startDate = OperationDate.create(new Date('2024-01-01'));
      const endDate = OperationDate.create(new Date('2024-01-31'));

      const statements = [
        StatementBalance.create({
          date: startDate,
          balance: Amount.create(1000),
        }),
        StatementBalance.create({
          date: endDate,
          balance: Amount.create(1000),
        }),
      ];

      const operationAtStart = BankOperation.create({
        id: 1,
        date: OperationDate.create(new Date('2024-01-01')),
        wording: Wording.create('VENTE'),
        amount: Amount.create(500),
      });

      const result = ReconciliationService.sync({
        operations: [operationAtStart],
        statements,
      });

      expect(result).toHaveLength(1);
      expect(result[0].message).toBe(REASON_MESSAGE.ACCEPTED);
    });

    it('should include operations at end date boundary', () => {
      const startDate = OperationDate.create(new Date('2024-01-01'));
      const endDate = OperationDate.create(new Date('2024-01-31'));

      const statements = [
        StatementBalance.create({
          date: startDate,
          balance: Amount.create(1000),
        }),
        StatementBalance.create({
          date: endDate,
          balance: Amount.create(1500),
        }),
      ];

      const operationAtEnd = BankOperation.create({
        id: 1,
        date: OperationDate.create(new Date('2024-01-31')),
        wording: Wording.create('VENTE'),
        amount: Amount.create(500),
      });

      const result = ReconciliationService.sync({
        operations: [operationAtEnd],
        statements,
      });

      expect(result).toHaveLength(1);
      expect(result[0].message).toBe(REASON_MESSAGE.ACCEPTED);
    });

    it('should handle empty operations list', () => {
      const startDate = OperationDate.create(new Date('2024-01-01'));
      const endDate = OperationDate.create(new Date('2024-01-31'));

      const statements = [
        StatementBalance.create({
          date: startDate,
          balance: Amount.create(1000),
        }),
        StatementBalance.create({
          date: endDate,
          balance: Amount.create(1000),
        }),
      ];

      const result = ReconciliationService.sync({
        operations: [],
        statements,
      });

      expect(result).toHaveLength(1);
      expect(result[0].message).toBe(REASON_MESSAGE.ACCEPTED);
    });

    it('should calculate gap correctly for negative variation', () => {
      const startDate = OperationDate.create(new Date('2024-01-01'));
      const endDate = OperationDate.create(new Date('2024-01-31'));

      const statements = [
        StatementBalance.create({
          date: startDate,
          balance: Amount.create(1000),
        }),
        StatementBalance.create({ date: endDate, balance: Amount.create(700) }),
      ];

      const operation = BankOperation.create({
        id: 1,
        date: OperationDate.create(new Date('2024-01-15')),
        wording: Wording.create('RETRAIT'),
        amount: Amount.create(-300),
      });

      const result = ReconciliationService.sync({
        operations: [operation],
        statements,
      });

      expect(result).toHaveLength(1);
      expect(result[0].message).toBe(REASON_MESSAGE.ACCEPTED);
    });
  });
});

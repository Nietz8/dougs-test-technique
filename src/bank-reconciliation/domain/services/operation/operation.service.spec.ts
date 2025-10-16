import { BankOperation } from '../../entities/bank-operation/bank-operation.entity';
import { Amount } from '../../value-objects/amount/amount.vo';
import { OperationDate } from '../../value-objects/operation-date/operation-date.vo';
import { Wording } from '../../value-objects/wording/wording.vo';
import { OperationService } from './operation.service';

describe('DuplicateDetectionService', () => {
  const makeOperation = (
    id: number,
    date: string,
    label: string,
    amount: number,
  ) =>
    BankOperation.create({
      id,
      date: OperationDate.create(date),
      wording: Wording.create(label),
      amount: Amount.create(amount),
    });

  it('should find duplicate operations', () => {
    const operations = [
      makeOperation(1, '2025-03-01', 'CARTE RESTO', -12.5),
      makeOperation(2, '2025-03-02', 'VIREMENT SALAIRE', 2500),
      makeOperation(1, '2025-03-01', 'CARTE RESTO', -12.5), // duplicate
    ];

    const duplicatedOperations = OperationService.findDuplicate(operations);

    expect(duplicatedOperations).toHaveLength(1);
    expect(duplicatedOperations[0].getWording().getValue()).toBe('CARTE RESTO');
  });

  it('should return empty array when no duplicates found', () => {
    const operations = [
      makeOperation(1, '2025-03-01', 'CARTE RESTO', -12.5),
      makeOperation(2, '2025-03-02', 'VIREMENT SALAIRE', 2500),
    ];

    const duplicatedOperations = OperationService.findDuplicate(operations);

    expect(duplicatedOperations).toHaveLength(0);
  });
});

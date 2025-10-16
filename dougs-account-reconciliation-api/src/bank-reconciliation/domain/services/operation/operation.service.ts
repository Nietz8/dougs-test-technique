import { BankOperation } from '../../entities/bank-operation/bank-operation.entity';
import { Amount } from '../../value-objects/amount/amount.vo';

export class OperationService {
  static findDuplicate(operations: BankOperation[]): BankOperation[] {
    const seenOperations = new Map<number, BankOperation>();
    const duplicatedIds = new Set<number>();

    for (const operation of operations) {
      const id = operation.getId();
      if (seenOperations.has(id)) {
        duplicatedIds.add(id);
      } else {
        seenOperations.set(id, operation);
      }
    }
    return [...duplicatedIds].map<BankOperation>(
      (id) => seenOperations.get(id)!,
    );
  }

  static getTotalOperationAmount(operations: BankOperation[]): Amount {
    return operations.reduce(
      (totalAmount, operation) => totalAmount.add(operation.getAmount()),
      Amount.create(0),
    );
  }
}

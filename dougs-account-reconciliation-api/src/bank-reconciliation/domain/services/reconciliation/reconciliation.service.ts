import { BankOperation } from '../../entities/bank-operation/bank-operation.entity';
import { Reason, REASON_CODE, REASON_MESSAGE } from '../../types/reason.type';
import { Amount } from '../../value-objects/amount/amount.vo';
import { OperationDate } from '../../value-objects/operation-date/operation-date.vo';
import { StatementBalance } from '../../value-objects/statement-balance/statement-balance.vo';
import { OperationService } from '../operation/operation.service';

export class ReconciliationService {
  private static sort<T extends BankOperation | StatementBalance>(
    data: T[],
  ): T[] {
    return [...data].sort((a: T, b: T) => a.getDate().compare(b.getDate()));
  }

  private static generateReason(params: {
    executionDate: Date;
    startDate: OperationDate;
    endDate: OperationDate;
    statementBalanceVariation: Amount;
    operations: BankOperation[];
  }): Reason {
    const {
      executionDate,
      startDate,
      endDate,
      statementBalanceVariation,
      operations,
    } = params;

    const totalOperationAmount =
      OperationService.getTotalOperationAmount(operations);

    if (statementBalanceVariation.equals(totalOperationAmount)) {
      return {
        executionDate,
        period: {
          startDate,
          endDate,
        },
        message: REASON_MESSAGE.ACCEPTED,
      };
    }

    const gapBetweenStatemantAndOperations =
      statementBalanceVariation.subtract(totalOperationAmount);

    const duplicates = OperationService.findDuplicate(operations);

    if (duplicates.length) {
      const duplicatedIds = duplicates.map((duplicate) => duplicate.getId());

      return {
        executionDate,
        period: {
          startDate,
          endDate,
        },
        message: REASON_MESSAGE.VALIDATION_FAILED,
        code: REASON_CODE.DUPLICATED_OPERATIONS,
        summary: `Found ${duplicates.length} duplicated operation(s) between ${startDate.toString()} and ${endDate.toString()}. Please review operations and remove duplicates of operation(s) with id(s) : [${duplicatedIds.join(',')}]`,
        duplicatedIds,
        duplicatedOperation: duplicates,
        statementsBalance: statementBalanceVariation,
        operationsBalance: totalOperationAmount,
        gap: gapBetweenStatemantAndOperations,
      };
    }

    return {
      executionDate,
      period: {
        startDate,
        endDate,
      },
      message: REASON_MESSAGE.VALIDATION_FAILED,
      code: REASON_CODE.MISSING_OPERATION,
      summary: `Balance mismatch detected between ${startDate.toString()} and ${endDate.toString()}. Expected variation: ${statementBalanceVariation.toString()}, Actual: ${totalOperationAmount.toString()}, Difference: ${gapBetweenStatemantAndOperations.toString()}`,
      statementsBalance: statementBalanceVariation,
      operationsBalance: totalOperationAmount,
      gap: gapBetweenStatemantAndOperations,
    };
  }

  static sync(command: {
    operations: BankOperation[];
    statements: StatementBalance[];
  }) {
    const executionDate = new Date();
    const sortedOperations = this.sort(command.operations);
    const sortedStatements = this.sort(command.statements);

    let operationIndex = 0;
    const reasons: Reason[] = [];

    for (let i = 0; i < sortedStatements.length - 1; i++) {
      const openingStatement = sortedStatements[i];
      const closingStatement = sortedStatements[i + 1];

      const startDate = openingStatement.getDate();
      const endDate = closingStatement.getDate();

      const operationsInPeriod: BankOperation[] = [];

      while (
        operationIndex < sortedOperations.length &&
        sortedOperations[operationIndex].getDate() <= endDate
      ) {
        const currentOperation = sortedOperations[operationIndex];
        if (currentOperation.getDate() > startDate) {
          operationsInPeriod.push(currentOperation);
        }
        operationIndex++;
      }

      const statementBalanceVariation = closingStatement
        .getBalance()
        .subtract(openingStatement.getBalance());

      const currentReason = this.generateReason({
        executionDate,
        startDate,
        endDate,
        statementBalanceVariation,
        operations: operationsInPeriod,
      });

      reasons.push(currentReason);
    }
    return reasons;
  }
}

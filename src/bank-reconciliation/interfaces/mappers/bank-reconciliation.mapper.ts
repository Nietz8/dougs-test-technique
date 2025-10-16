import { BankOperation } from '../../domain/entities/bank-operation/bank-operation.entity';
import { StatementBalance } from '../../domain/value-objects/statement-balance/statement-balance.vo';
import { OperationDate } from '../../domain/value-objects/operation-date/operation-date.vo';
import { Wording } from '../../domain/value-objects/wording/wording.vo';
import { Amount } from '../../domain/value-objects/amount/amount.vo';
import { ValidateBankReconciliationRequestDto } from '../dtos/validate-bank-reconciliation-request.dto';
import { Reason, REASON_MESSAGE } from '../../domain/types/reason.type';
import {
  ReasonResponseDto,
  ReconciliationResponseDTO,
} from '../dtos/reconciliation-result-response.dto';

export class BankReconciliationMapper {
  private static toDomainOperation(movement: {
    id: number;
    date: string;
    wording: string;
    amount: number;
  }): BankOperation {
    return BankOperation.create({
      id: movement.id,
      date: OperationDate.create(movement.date),
      wording: Wording.create(movement.wording),
      amount: Amount.create(movement.amount),
    });
  }

  private static toDomainStatement(balance: {
    date: string;
    balance: number;
  }): StatementBalance {
    return StatementBalance.create({
      date: OperationDate.create(balance.date),
      balance: Amount.create(balance.balance),
    });
  }

  static toCommand(request: ValidateBankReconciliationRequestDto): {
    operations: BankOperation[];
    statements: StatementBalance[];
  } {
    const { movements, balances } = request;

    const operations = movements.map((mouvement) =>
      this.toDomainOperation(mouvement),
    );

    const statements = balances.map((balance) =>
      this.toDomainStatement(balance),
    );

    return { operations, statements };
  }

  static toResponseDto(reasons: Reason[]): ReconciliationResponseDTO {
    const responseReasons = reasons.map((reason) => {
      const data: ReasonResponseDto = {
        executionDate: reason.executionDate.toISOString(),
        period: {
          startDate: reason.period.startDate.toString(),
          endDate: reason.period.endDate.toString(),
        },
        message: reason.message,
        code: reason.code,
      };

      if (reason.summary) {
        Object.assign(data, { summary: reason.summary });
      }

      if (reason.duplicatedIds?.length) {
        Object.assign(data, {
          duplicatedIds: reason.duplicatedIds,
          duplicatedOperation: reason.duplicatedOperation?.map((operation) => ({
            id: operation.getId(),
            date: operation.getDate().getValue(),
            wording: operation.getWording().getValue(),
            amount: operation.getAmount().getValue(),
          })),
        });
      }

      if (reason.statementsBalance) {
        Object.assign(data, {
          statementsBalance: reason.statementsBalance.getValue(),
        });
      }

      if (reason.operationsBalance) {
        Object.assign(data, {
          operationsBalance: reason.operationsBalance.getValue(),
        });
      }

      if (reason.gap) {
        Object.assign(data, {
          gap: reason.gap.getValue(),
        });
      }

      return data;
    });

    return {
      isValid: !reasons.some(
        (reason) => reason.message === REASON_MESSAGE.VALIDATION_FAILED,
      ),
      reasons: responseReasons,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { BankOperation } from '../../domain/entities/bank-operation/bank-operation.entity';
import { ReconciliationService } from '../../domain/services/reconciliation/reconciliation.service';
import { Reason } from '../../domain/types/reason.type';
import { StatementBalance } from '../../domain/value-objects/statement-balance/statement-balance.vo';
@Injectable()
export class ValidateBankReconciliationUseCase {
  execute(command: {
    operations: BankOperation[];
    statements: StatementBalance[];
  }): Reason[] {
    return ReconciliationService.sync(command);
  }
}

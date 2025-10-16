import { Module } from '@nestjs/common';
import { BankReconciliationController } from './interfaces/http/bank-reconciliation/bank-reconciliation.controller';
import { ValidateBankReconciliationUseCase } from './application/use-cases/validate-bank-reconciliation.usecase';

@Module({
  controllers: [BankReconciliationController],
  providers: [ValidateBankReconciliationUseCase],
})
export class BankReconciliationModule {}

import { BankOperation } from '../entities/bank-operation/bank-operation.entity';
import { Amount } from '../value-objects/amount/amount.vo';
import { OperationDate } from '../value-objects/operation-date/operation-date.vo';

export enum REASON_MESSAGE {
  ACCEPTED = 'ACCEPTED',
  VALIDATION_FAILED = 'VALIDATION FAILED',
}

export enum REASON_CODE {
  MISSING_OPERATION = 'MISSING_OPERATION',
  DUPLICATED_OPERATIONS = 'DUPLICATED_OPERATIONS',
}

export interface Operation {
  id: number;
  date: string;
  wording: string;
  amount: string;
}

export interface Reason {
  executionDate: Date;
  period: {
    startDate: OperationDate;
    endDate: OperationDate;
  };
  message: REASON_MESSAGE;
  code?: REASON_CODE;
  summary?: string;
  duplicatedIds?: number[];
  duplicatedOperation?: BankOperation[];
  statementsBalance?: Amount;
  operationsBalance?: Amount;
  gap?: Amount;
}

export interface ReasonResponse {
  executionDate: string;
  period: {
    startDate: string;
    endDate: string;
  };
  message: string;
  code?: string;
  summary?: string;
  numberOfDuplicates?: number;
  duplicatedIds?: number[];
  duplicatedOperation?: Operation[];
  statementsBalance?: number;
  operationsBalance?: number;
  gap?: number;
}

export interface ReasonResponseDTO {
  isvalid: boolean;
  reasons: ReasonResponse[];
}

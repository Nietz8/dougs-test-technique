import { ApiProperty } from '@nestjs/swagger';

export class OperationDto {
  @ApiProperty({
    description: 'ID of the operation',
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: 'Date of the operation',
    example: '2025-01-07',
    required: true,
  })
  date: string;

  @ApiProperty({
    description: 'Wording of the operation',
    example: 'ABONNEMENT TELEPHONE',
    required: true,
  })
  wording: string;

  @ApiProperty({
    description: 'Amount of the operation',
    example: 200,
    required: true,
  })
  amount: number;
}

export class PeriodDto {
  @ApiProperty({
    description: 'Date of the starting statement',
    example: '2025-01-02',
    required: true,
  })
  startDate: string;

  @ApiProperty({
    description: 'Date of the ending statement',
    example: '2025-01-18',
    required: true,
  })
  endDate: string;
}

export class ReasonResponseDto {
  @ApiProperty({
    description: 'Date of the validation',
    example: '2025-01-22T15:00:00.000Z',
    required: true,
  })
  executionDate: string;

  @ApiProperty({
    description: 'Validation period',
    type: PeriodDto,
    required: true,
  })
  period: PeriodDto;

  @ApiProperty({
    description: 'Validation message',
    example: 'VALIDATION FAILED',
    required: true,
  })
  message: string;

  @ApiProperty({
    description: 'Details of balance mismatch',
    example: 'MISSING_OPERATION',
    required: false,
  })
  code?: string;

  @ApiProperty({
    description: 'Summary of the validation',
    required: false,
    example:
      'Balance mismatch detected between 2025-01-03 and 2025-01-16. Expected variation: 2500.00, Actual: 2200.00, Difference: 300.00',
  })
  summary?: string;

  @ApiProperty({
    description: 'Number of duplicated operations found during reconciliation',
    required: false,
  })
  numberOfDuplicates?: number;

  @ApiProperty({
    description: 'Ids of duplicated operations found during reconciliation',
    type: [Number],
    required: false,
  })
  duplicatedIds?: number[];

  @ApiProperty({
    description: 'List of duplicated operations found during reconciliation',
    type: [OperationDto],
    required: false,
  })
  duplicatedOperation?: OperationDto[];

  @ApiProperty({
    description: 'Period balance of bank statements given by the client',
    example: 2500,
    required: false,
  })
  statementsBalance?: number;

  @ApiProperty({
    description: 'Total operation amount during the reconciliation period',
    example: 2200,
    required: false,
  })
  operationsBalance?: number;

  @ApiProperty({
    description:
      'Difference between statement variation balance and total operation for a reconciliation period',
    example: 300,
    required: false,
  })
  gap?: number;
}

export class ReconciliationResponseDTO {
  @ApiProperty({
    description: 'Informs if the reconciliation do not have any issue',
    required: true,
  })
  isValid: boolean;

  @ApiProperty({
    description: 'List of reason explaining why reconciliation failed',
    type: [ReasonResponseDto],
    required: true,
  })
  reasons: ReasonResponseDto[];
}

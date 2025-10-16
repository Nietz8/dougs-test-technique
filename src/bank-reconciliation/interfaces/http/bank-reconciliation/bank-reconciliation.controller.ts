import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ValidateBankReconciliationUseCase } from '../../../application/use-cases/validate-bank-reconciliation.usecase';
import { ValidateBankReconciliationRequestDto } from '../../dtos/validate-bank-reconciliation-request.dto';
import { BankReconciliationMapper } from '../../mappers/bank-reconciliation.mapper';
import { ReconciliationResponseDTO } from '../../dtos/reconciliation-result-response.dto';

@ApiTags('Bank Reconciliation')
@Controller('movements')
export class BankReconciliationController {
  constructor(
    private readonly validateBankReconciliationUseCase: ValidateBankReconciliationUseCase,
  ) {}

  @Post('validation')
  @ApiOperation({
    summary: 'Validate bank reconciliation',
    description:
      'Validates the integrity of bank synchronization by comparing operations with certified balance statements. ' +
      'Returns detailed information about any discrepancies found (duplicates, balance mismatches, etc.) with actionable suggestions for accountants.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Reconciliation validation completed successfully. Check isValid field and reasons array for details.',
    type: ReconciliationResponseDTO,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid request format (missing required fields, invalid data types, etc.)',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error during validation',
  })
  validateBankReconciliation(
    @Body() request: ValidateBankReconciliationRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): ReconciliationResponseDTO {
    const command = BankReconciliationMapper.toCommand(request);
    const result = this.validateBankReconciliationUseCase.execute(command);
    const responseDTO = BankReconciliationMapper.toResponseDto(result);

    const status = responseDTO.isValid ? HttpStatus.OK : HttpStatus.BAD_REQUEST;

    response.status(status);

    return responseDTO;
  }
}

import {
  IsArray,
  ValidateNested,
  IsNumber,
  IsString,
  IsDateString,
  IsNotEmpty,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MovementDto {
  @ApiProperty({
    description: 'Unique identifier of the operation',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'Date of the operation',
    example: '2025-03-01',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Label/wording of the operation',
    example: 'DEPOT',
  })
  @IsString()
  @IsNotEmpty()
  wording: string;

  @ApiProperty({
    description:
      'Amount of the operation (positive for credit, negative for debit)',
    example: 500,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class BalanceDto {
  @ApiProperty({
    description: 'Date of the balance statement',
    example: '2025-02-28',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: 'Balance amount at this date', example: 1500 })
  @IsNumber()
  @IsNotEmpty()
  balance: number;
}

export class ValidateBankReconciliationRequestDto {
  @ApiProperty({
    description: 'List of bank operations to validate',
    type: [MovementDto],
    example: [
      { id: 1, date: '2025-03-01', wording: 'DEPOT', amount: 500 },
      { id: 2, date: '2025-03-05', wording: 'CARTE', amount: -100 },
    ],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'Movements array can not be empty.' })
  @ValidateNested({ each: true })
  @Type(() => MovementDto)
  movements: MovementDto[];

  @ApiProperty({
    description: 'List of certified balance statements for control points',
    type: [BalanceDto],
    example: [
      { date: '2025-02-28', balance: 1500 },
      { date: '2025-03-31', balance: 4000 },
    ],
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'Balances array can not be empty.' })
  @ArrayMinSize(2, {
    message:
      'Balances must represent at least 2 statements at differents dates.',
  })
  @ValidateNested({ each: true })
  @Type(() => BalanceDto)
  balances: BalanceDto[];
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../bank-reconciliation/domain/exceptions/domain-error';

@Injectable()
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      return response.status(status).json({
        statusCode: status,
        ...(typeof exceptionResponse === 'object'
          ? exceptionResponse
          : { message: exceptionResponse }),
        timestamp: new Date().toISOString(),
      });
    }

    if (exception instanceof DomainError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        code: exception.code,
        details: exception.message,
        context: exception.context,
        timestamp: new Date().toISOString(),
      });
    }

    const errorMessage =
      exception instanceof Error
        ? exception.message
        : 'Unexpected error occurred';

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
      details: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}

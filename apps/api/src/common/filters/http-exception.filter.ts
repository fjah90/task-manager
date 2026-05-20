import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ZodError } from 'zod';

interface ErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

const HTTP_CODE_MAP: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE_ENTITY',
  500: 'INTERNAL_ERROR',
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof ZodError) {
      const body: ErrorBody = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: exception.issues,
        },
      };
      res.status(HttpStatus.BAD_REQUEST).json(body);
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message =
        typeof response === 'string'
          ? response
          : ((response as { message?: string }).message ?? exception.message);
      const code =
        (typeof response === 'object' &&
          (response as { code?: string }).code) ||
        HTTP_CODE_MAP[status] ||
        'ERROR';

      const body: ErrorBody = { error: { code, message } };
      res.status(status).json(body);
      return;
    }

    this.logger.error('Unhandled exception', exception as Error);
    const body: ErrorBody = {
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
    };
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
  }
}

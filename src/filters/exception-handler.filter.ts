import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseConflictException, BaseValidationException } from 'src/exceptions/base.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    switch (true) {
      case exception instanceof BaseValidationException:
        response.status(HttpStatus.BAD_REQUEST);
        response.json({
          error: exception.errors,
        });
        break;
      case exception instanceof BaseConflictException:
        response.status(HttpStatus.CONFLICT);
        response.json({
          error: exception.errors,
        });
        break;
      default:
        response.status(HttpStatus.INTERNAL_SERVER_ERROR);
        response.json({
          message: 'something went wrong',
          errors: exception.stack,
        });
    }
  }
}

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
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
      case exception instanceof BadRequestException:
        response.status(HttpStatus.BAD_REQUEST);
        this.toJson(exception, response);
        break;
      default:
        // console.log(exception);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR);
        response.json({
          message: 'something went wrong',
          errors: exception.stack,
        });
    }
  }

  private toJson(exception: Error, res: Response): void {
    res.json({
      error: {
        name: exception.constructor.name || 'Error',
        message: exception.message,
      },
    });
  }
}

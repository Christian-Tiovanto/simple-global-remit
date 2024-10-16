import { HttpStatus } from '@nestjs/common';
import { JsonApiDetailValidationError, JsonApiValidationError } from 'src/interfaces/json-api-error.interface';
import { BaseValidationException } from './base.exception';

export class ExchangeForeignConstraintException extends BaseValidationException {
  public errors: JsonApiValidationError;
  constructor(message: string, detail: JsonApiDetailValidationError) {
    super(message);
    this.errors = {
      status: HttpStatus.BAD_REQUEST.toString(),
      title: message,
      source: detail.key,
      value: detail.value,
      type: 'Foreign Key Constraint',
    };
  }
}

import { JsonApiDetailValidationError, JsonApiValidationError } from 'src/interfaces/json-api-error.interface';
import { BaseValidationException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class ValidationError extends BaseValidationException {
  public errors: JsonApiValidationError;
  constructor(message: string, detail: JsonApiDetailValidationError) {
    super(message);
    this.errors = {
      status: HttpStatus.BAD_REQUEST.toString(),
      title: message,
      source: detail.key,
      value: detail.value,
      type: 'Validation Error',
    };
  }
}

import { JsonApiConflictError, JsonApiDetailConflictError } from 'src/interfaces/json-api-error.interface';
import { BaseConflictException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class DuplicateEmailException extends BaseConflictException {
  public errors: JsonApiConflictError;
  constructor(message: string, detail: JsonApiDetailConflictError) {
    super(message);
    this.errors = {
      status: HttpStatus.BAD_REQUEST.toString(),
      title: message,
      source: detail.key,
      value: detail.value,
      type: 'Email Validation Error',
    };
  }
}

import { JsonApiConflictError } from 'src/interfaces/json-api-error.interface';
import { BaseConflictException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class DuplicateEmailException extends BaseConflictException {
  public errors: JsonApiConflictError;
  constructor(message: string, key: string, value: string) {
    super(message);
    this.errors = {
      status: HttpStatus.BAD_REQUEST.toString(),
      title: message,
      source: key,
      value,
    };
  }
}

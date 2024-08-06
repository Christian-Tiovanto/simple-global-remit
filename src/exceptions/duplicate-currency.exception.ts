import {
  JsonApiConflictError,
  JsonApiDetailConflictError,
} from 'src/interfaces/json-api-error.interface';
import { BaseConflictException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class DuplicateCurrencyException extends BaseConflictException {
  public errors: JsonApiConflictError;
  constructor(message: string, detail: JsonApiDetailConflictError) {
    super(message);
    this.errors = {
      title: message,
      source: detail.key,
      status: HttpStatus.CONFLICT.toString(),
      value: detail.value,
    };
  }
}

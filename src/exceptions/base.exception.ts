import {
  JsonApiConflictError,
  JsonApiValidationError,
} from 'src/interfaces/json-api-error.interface';

export abstract class BaseValidationException extends Error {
  public abstract errors: JsonApiValidationError;
}

export abstract class BaseConflictException extends Error {
  public abstract errors: JsonApiConflictError[];
}

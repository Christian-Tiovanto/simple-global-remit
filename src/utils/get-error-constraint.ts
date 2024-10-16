import { ErrorCode } from 'src/enums/error-code';
import { DuplicateExchangeException } from 'src/exceptions/duplicate-exchange-rate.exception';
import { ExchangeForeignConstraintException } from 'src/exceptions/exchange-foreignkey.exception';
import { QueryFailedError } from 'typeorm';

export function getDuplicateErrorDetail(error) {
  const regex = /Key \(([^,]+),\s*([^)\s]+)\)=\(([^,]+),\s*([^)]+)\)/;
  const errorDetail = error.driverError.detail.match(regex);
  if (errorDetail) {
    const errorDetailKey = [errorDetail[1], errorDetail[2]];
    const errorDetailVal = [errorDetail[3], errorDetail[4]];
    throw new DuplicateExchangeException('Duplicate Exchange Rate', { value: errorDetailVal, key: errorDetailKey });
  }
  throw error;
}

export function getForeignKeyErrorDetail(error) {
  const regex = /Key \(([^)]+)\)=\(([^)]+)\)/;
  const errorDetail = error.driverError.detail.match(regex);
  const errorDetailKey = errorDetail[1];
  const errorDetailValue = errorDetail[2];
  throw new ExchangeForeignConstraintException(`${errorDetailValue}from ${errorDetailKey} doesnt exist`, {
    key: errorDetailKey,
    value: errorDetailValue,
  });
}

export function getConstraintError(error) {
  if (
    error instanceof QueryFailedError &&
    error.driverError.code === ErrorCode.POSTGRES_FOREIGN_KEY_CONSTRAINT_ERROR_CODE
  )
    getForeignKeyErrorDetail(error);
  if (error instanceof QueryFailedError && error.driverError.code === ErrorCode.POSTGRES_UNIQUE_VIOLATION_ERROR_CODE)
    getDuplicateErrorDetail(error);
  throw error;
}

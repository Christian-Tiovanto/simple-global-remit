import { TransformFnParams } from 'class-transformer';

export const parseBoolean = ({ value }: TransformFnParams): boolean => {
  return value === 'true' ? true : value === 'false' ? false : undefined;
};

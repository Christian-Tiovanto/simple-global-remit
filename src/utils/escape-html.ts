import { TransformFnParams } from 'class-transformer';

export const escapeHtml = ({ value }: TransformFnParams): string => {
  if (typeof value !== 'string') return value;
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

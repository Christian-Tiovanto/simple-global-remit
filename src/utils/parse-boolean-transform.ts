import { TransformFnParams } from 'class-transformer';

export function parseBoolean(value: TransformFnParams | string | boolean): boolean {
  if (typeof value === 'object' && 'value' in value) {
    const valueTransform = value.value;
    return valueTransform === 'true' ? true : valueTransform === 'false' ? false : undefined;
  } else {
    return value === 'true' ? true : value === 'false' ? false : undefined;
  }
}

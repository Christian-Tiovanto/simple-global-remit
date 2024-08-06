import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationError } from 'src/exceptions/validation-error.exception';

@Injectable()
export class DataValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type != 'body') return value;
    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const errorsKey = errors.map((error) => {
        return error.property;
      });
      const errorsValue = errors.map((error) => {
        return error.constraints;
      });
      throw new ValidationError('Validation Error', { key: errorsKey, value: errorsValue });
    }
    return value;
  }
}

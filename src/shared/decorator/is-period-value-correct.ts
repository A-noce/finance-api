import { WeekDay } from '@typing/enums';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsPeriodValueCorrect(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPeriodValueCorrect',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value === 'string' && /^[1-9]$|^[12][0-9]$|^3[01]$/.test(value)) {
            return true;
          }

          if (
            Array.isArray(value) &&
            value.every((v) => Object.values(WeekDay).includes(v))
          ) {
            return true;
          }

          return false;
        },

        defaultMessage(_args: ValidationArguments) {
          return `Value must be a valid date (1 to 31) or an array of ${Object.values(WeekDay).join(',')}`
        },
      },
    });
  };
}

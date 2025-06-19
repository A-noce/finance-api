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
        validate(value: string, _args: ValidationArguments) {
          if (/^(0?[1-9]|[12][0-9]|3[01])$/.test(value)) {
            return true;
          }

          const weekDaysName = Object.keys(WeekDay).filter(
            (k: number | string) => isNaN(Number(k)),
          );

          if (
            /,/g.test(value) &&
            value.split(',').every((v) => weekDaysName.includes(v))
          ) {
            return true;
          }

          return false;
        },

        defaultMessage(_args: ValidationArguments) {
          const weekDaysName = Object.keys(WeekDay).filter(
            (k: number | string) => isNaN(Number(k)),
          );
          return `Value must be a valid date (1 to 31) or an array string  of ${weekDaysName.join(',')}`;
        },
      },
    });
  };
}

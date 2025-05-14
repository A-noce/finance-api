export enum TransactionTypeEnum {
    INPUT = "INPUT",
    OUTPUT = "OUTPUT"
}

export enum TransactionPeriodEnum {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    TWO_MONTHS = 'TWO_MONTHS',
    THREE_MONTHS = "THREE_MONTHS",
    ONCE = "ONCE"
}

export enum WeekDay {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNEsDAY = 3,
    THUSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
}

export const MonthEnum = {
  JANUARY: 1,
  FEBRUARY: 2,
  MARCH: 3,
  APRIL: 4,
  MAY: 5,
  JUNE: 6,
  JULY: 7,
  AUGUST: 8,
  SEPTEMBER: 9,
  OCTOBER: 10,
  NOVEMBER: 11,
  DECEMBER: 12
} as const;

export type MonthEnumKey = keyof typeof MonthEnum;
import {
  Between,
  FindManyOptions,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
} from 'typeorm';
import { Transaction } from '@transaction/entity/transaction.entity';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationParamDTO } from '@shared/dtos/PaginationParam.dto';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { TransactionPeriodEnum, TransactionTypeEnum } from '@typing/enums';
import { Type } from 'class-transformer';

export class FilterTransactionParamsRequestDTO extends PaginationParamDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  periodicity: TransactionPeriodEnum[];

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  minimumValue?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  maximumValue?: number;

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endtDate: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  listInputTagId: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  listOutputTagId: number[];

  public buildFilter() {
    const query: FindManyOptions<Transaction> = {};
    const {
      title,
      description,
      periodicity,
      startDate,
      endtDate,
      minimumValue,
      maximumValue,
      listInputTagId,
      listOutputTagId,
    } = this;

    if (title) {
      const param: FindManyOptions<Transaction> = {
        where: {
          title: Like(title),
        },
      };
      Object.assign(query, param);
    }
    if (description) {
      const param: FindManyOptions<Transaction> = {
        where: {
          description: Like(description),
        },
      };
      Object.assign(query, param);
    }
    if (periodicity) {
      const param: FindManyOptions<Transaction> = {
        where: {
          periodicity: In(periodicity),
        },
      };
      Object.assign(query, param);
    }
    if (listInputTagId) {
      const param: FindManyOptions<Transaction> = {
        where: {
          transactionTag: {
            id: In(listInputTagId),
            transactionType: TransactionTypeEnum.INPUT,
          },
        },
      };
      Object.assign(query, param);
    }
    if (listOutputTagId) {
      const param: FindManyOptions<Transaction> = {
        where: {
          transactionTag: {
            id: In(listOutputTagId),
            transactionType: TransactionTypeEnum.OUTPUT,
          },
        },
      };
      Object.assign(query, param);
    }

    if (minimumValue && !maximumValue) {
      const param: FindManyOptions<Transaction> = {
        where: {
          value: MoreThanOrEqual(minimumValue),
        },
      };
      Object.assign(query, param);
    }
    if (!minimumValue && maximumValue) {
      const param: FindManyOptions<Transaction> = {
        where: {
          value: LessThanOrEqual(maximumValue),
        },
      };
      Object.assign(query, param);
    }
    if (minimumValue && maximumValue) {
      const param: FindManyOptions<Transaction> = {
        where: {
          value: Between(minimumValue, maximumValue),
        },
      };
      Object.assign(query, param);
    }

    if (startDate && !endtDate) {
      const param: FindManyOptions<Transaction> = {
        where: {
          createdAt: MoreThanOrEqual(startOfDay(parseISO(startDate))),
        },
      };

      if (!startDate && endtDate) {
        const param: FindManyOptions<Transaction> = {
          where: {
            createdAt: LessThanOrEqual(endOfDay(parseISO(endtDate))),
          },
        };
        Object.assign(query, param);
      }

      Object.assign(query, param);
    }
    if (startDate && endtDate) {
      const param: FindManyOptions<Transaction> = {
        where: {
          createdAt: Between(parseISO(startDate), parseISO(endtDate)),
        },
      };
      Object.assign(query, param);
    }
    Object.assign(query, this.buildPaginationParams());
    return query;
  }
}

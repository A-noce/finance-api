import { Between, FindManyOptions, In, LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { Transaction } from '@transaction/entity/transaction.entity';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationParamDTO } from '@shared/dtos/PaginationParam.dto';
import { parseISO } from 'date-fns';
import { TransactionPeriodEnum } from '@typing/enums';
import { Type } from 'class-transformer';
import { TransactionHistory } from '@transaction-history/entity/transaction-history.entity';

export class FilterTransactionHistoryParamsRequestDTO extends PaginationParamDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  periodicity: TransactionPeriodEnum[]

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  minimumValue?: number

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  maximumValue?: number

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endtDate: string;

  public buildFilter() {
    const query: FindManyOptions<TransactionHistory> = {};
    const {title, description, periodicity, startDate, endtDate, minimumValue, maximumValue } = this;

    if (title) {
      const param: FindManyOptions<TransactionHistory> = {
        where: {
          title: Like(title),
        },
      };
      Object.assign(query, param);
    }
    if (description) {
      const param: FindManyOptions<TransactionHistory> = {
        where: {
          description: Like(description),
        },
      };
      Object.assign(query, param);
    }

    if (minimumValue && !maximumValue) {
      const param: FindManyOptions<TransactionHistory> = {
        where: {
         value: MoreThanOrEqual(minimumValue),
        },
      };
      Object.assign(query, param);
    }
    if (!minimumValue && maximumValue) {
      const param: FindManyOptions<TransactionHistory> = {
        where: {
          value: LessThanOrEqual(maximumValue)
        },
      };
      Object.assign(query, param);
    }
    if (minimumValue && maximumValue) {
      const param: FindManyOptions<TransactionHistory> = {
        where: {
          value: Between(minimumValue, maximumValue),
        },
      };
      Object.assign(query, param);
    }

    if (startDate && !endtDate) {
      const param: FindManyOptions<TransactionHistory> = {
        where: {
          date: LessThanOrEqual(endtDate),
        },
      };
      Object.assign(query, param);
    }
    if (!startDate && endtDate) {
      const param: FindManyOptions<TransactionHistory> = {
        where: {
          date: LessThanOrEqual(endtDate),
        },
      };
      Object.assign(query, param);
    }
    if (startDate && endtDate) {
      const param: FindManyOptions<TransactionHistory> = {
        where: {
          date: Between(startDate, endtDate),
        },
      };
      Object.assign(query, param);
    }    
    Object.assign(query, this.buildPaginationParams());
    return query;
  }
}

import { Between, FindManyOptions, In, LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { Transaction } from '@transaction/entity/transaction.entity';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { PaginationParamDTO } from '@shared/dtos/PaginationParam.dto';
import { parseISO } from 'date-fns';
import { TransactionPeriodEnum } from '@typing/enums';

export class FilterTransactionParamsRequestDTO extends PaginationParamDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  periodicity: TransactionPeriodEnum[]

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endtDate: string;

  public buildFilter() {
    const query: FindManyOptions<Transaction> = {};
    const {title, description, periodicity, startDate, endtDate } = this;

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
    if (startDate && !endtDate) {
      const param: FindManyOptions<Transaction> = {
        where: {
          createdAt: MoreThanOrEqual(parseISO(startDate)),
        },
      };
      Object.assign(query, param);
    }
    if (!startDate && endtDate) {
      const param: FindManyOptions<Transaction> = {
        where: {
          createdAt: LessThanOrEqual(parseISO(endtDate)),
        },
      };
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

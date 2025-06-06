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
import { parseISO } from 'date-fns';
import { TransactionPeriodEnum } from '@typing/enums';
import { Transform, Type } from 'class-transformer';
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
  endDate: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  @Transform(({ value }) => value.split(',').map(Number))
  tag: number[];

}

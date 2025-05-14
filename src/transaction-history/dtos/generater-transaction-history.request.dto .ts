import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class GenerateTransactionHistoryRequestDTO {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  transactionId?: number
}

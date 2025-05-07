import {
  IsDateString,
} from 'class-validator';

export class GenerateTransactionHistoryRequestDTO {
  @IsDateString()
  date: string;
}

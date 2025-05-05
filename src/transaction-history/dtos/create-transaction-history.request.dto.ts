import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionHistoryRequestDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  listInputTagId: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  listOutputTagId: number[];
}

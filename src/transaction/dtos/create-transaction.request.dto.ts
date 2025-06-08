import { IsPeriodValueCorrect } from "@shared/decorator/is-period-value-correct";
import { TransactionPeriodEnum } from "@typing/enums";
import { ArrayMinSize, IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionRequestDTO {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsEnum(TransactionPeriodEnum)
    @IsNotEmpty()
    periodicity: TransactionPeriodEnum
 
    @IsPeriodValueCorrect()
    @IsNotEmpty()
    periodValue: string

    @IsNumber()
    @IsNotEmpty()
    value: number

    @IsNumber()
    @IsNotEmpty()
    userId: number

    @IsArray()
    @IsInt({ each: true})
    @IsOptional()
    listInputTagId: number[]
    
    @IsArray()
    @IsInt({ each: true})
    @ArrayMinSize(1)
    listOutputTagId: number[]
}
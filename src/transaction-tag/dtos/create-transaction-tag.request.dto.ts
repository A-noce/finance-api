import { TagEntity } from "@tag/entity/tag.entity";
import { Transaction } from "@transaction/entity/transaction.entity";
import { TransactionTypeEnum } from "@typing/enums";
import { IsEnum, IsNotEmpty } from "class-validator";

export class CreateTransactionTagRequestDTO {
    @IsNotEmpty()
    transaction: Transaction

    @IsNotEmpty()
    tag: TagEntity

    @IsEnum(TransactionTypeEnum)
    @IsNotEmpty()
    tansactionType: TransactionTypeEnum
}
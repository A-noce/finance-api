
import { TransactionTypeEnum } from "@typing/enums";
import { IsEnum, IsNotEmpty } from "class-validator";
import { TransactionHistory } from "@transaction-history/entity/transaction-history.entity";
import { TagHistory } from "@tag-history/entity/tag-history.entity";

export class CreateTransactionTagHistoryRequestDTO {
    @IsNotEmpty()
    transactionHistory: TransactionHistory

    @IsNotEmpty()
    tagHistory: TagHistory

    @IsEnum(TransactionTypeEnum)
    @IsNotEmpty()
    tansactionType: TransactionTypeEnum
}
import { GenericEntity } from "@shared/entity/Generic.entity";
import { TransactionTypeEnum } from "@typing/enums";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { TransactionHistory } from "@transaction-history/entity/transaction-history.entity";
import { TagHistory } from "@tag-history/entity/tag-history.entity";

@Entity('transaction-tag-history')
export class TransactionTagHistory extends GenericEntity {
    @ManyToOne(() => TransactionHistory, (transaction) => transaction.transactionTag)
    @JoinColumn({ name: 'transaction_history_id' })
    transactionHistory: TransactionHistory

    @ManyToOne(() => TagHistory, (tag) => tag.transactionTag)
    @JoinColumn({ name: 'tag_history_id' })
    tagHistory: TagHistory
  

    @Column({ name: 'transaction_type'})
    transactionType: TransactionTypeEnum
}
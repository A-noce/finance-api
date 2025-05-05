import { GenericEntity } from "@shared/entity/Generic.entity";
import { TagEntity } from "@tag/entity/tag.entity";
import { Transaction } from "@transaction/entity/transaction.entity";
import { TransactionTypeEnum } from "@typing/enums";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('transaction-tag')
export class TransactionTag extends GenericEntity {
    @ManyToOne(() => Transaction, (transaction) => transaction.transactionTag)
    @JoinColumn({ name: 'transaction_id' })
    transaction: Transaction

    @ManyToOne(() => TagEntity, (tag) => tag.transactionTag)
    @JoinColumn({ name: 'tag_id' })
    tag: TagEntity
  

    @Column({ name: 'transaction_type'})
    transactionType: TransactionTypeEnum
}
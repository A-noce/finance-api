import { GenericEntity } from '@shared/entity/Generic.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Transaction } from '@transaction/entity/transaction.entity';
import { User } from '@user/entity/user.entity';
import { TransactionTagHistory } from 'src/transaction-tag-history/entity/transaction-tag-history.entity';

@Entity('transaction_history')
export class TransactionHistory extends GenericEntity {

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'date'})
  date: string;

  @OneToMany(
    () => TransactionTagHistory,
    (transactionTagHistory) => transactionTagHistory.transactionHistory,
  )
  transactionTag: TransactionTagHistory[];

  @ManyToOne(() => Transaction, (transaction) => transaction.transactionHistory, { nullable: true})
  @JoinColumn({ name: 'transaction_id'  })
  transaction: Transaction;

  @ManyToOne(() => User, (user) => user.transactionHistory)
  @JoinColumn({ name: 'user_id' })
  user: User;

}

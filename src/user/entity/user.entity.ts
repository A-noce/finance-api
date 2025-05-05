import { GenericEntity } from '@shared/entity/Generic.entity';
import { TransactionHistory } from '@transaction-history/entity/transaction-history.entity';
import { Transaction } from '@transaction/entity/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User extends GenericEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(
    () => TransactionHistory,
    (transactionHistory) => transactionHistory.user,
  )
  transactionHistory: TransactionHistory[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transaction: Transaction[];
}

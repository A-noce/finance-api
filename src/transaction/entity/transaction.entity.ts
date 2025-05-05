import { GenericEntity } from '@shared/entity/Generic.entity';
import { TransactionPeriodEnum, WeekDay } from '@typing/enums';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TransactionTag } from 'src/transaction-tag/entity/transaction-tag.entity';
import { TransactionHistory } from '@transaction-history/entity/transaction-history.entity';
import { User } from '@user/entity/user.entity';
import { format } from 'date-fns';

@Entity('transaction')
export class Transaction extends GenericEntity {
  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column()
  periodicity: TransactionPeriodEnum;

  @Column({ name: 'period_value' })
  periodValue: string;

  @Column({default: 0})
  value: number

  @OneToMany(
    () => TransactionTag,
    (transactionTag) => transactionTag.transaction,
  )
  transactionTag: TransactionTag[];

  @OneToMany(
    () => TransactionHistory,
    (transactionHistory) => transactionHistory.transaction,
  )
  transactionHistory: TransactionHistory[];

  @ManyToOne(() => User, (user) => user.transaction)
  @JoinColumn({ name: 'user_id' })
  user: User;

  formatedPeriod() {
    switch (this.periodicity) {
      case TransactionPeriodEnum.WEEKLY:
        const array = this.periodValue.split(',');
        return array.map((value) => WeekDay[value]) as WeekDay[]
      case TransactionPeriodEnum.MONTHLY:
      case TransactionPeriodEnum.TWO_MONTHS:
      case TransactionPeriodEnum.THREE_MONTHS: {
        const day = Number(this.periodValue);
        const today = new Date();
        return format(new Date(today.getFullYear(), today.getMonth(), day),'MM-dd-yyyy');
      }
      case TransactionPeriodEnum.DAILY:
        return '';
      case TransactionPeriodEnum.ONCE:
        const [year, month, day] = this.periodValue.split('-');
        return format(new Date(Number(year), Number(month) - 1, Number(day)), 'MM-dd-yyyy');
    }
  }
}

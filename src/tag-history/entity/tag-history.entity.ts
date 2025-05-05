import { GenericEntity } from '@shared/entity/Generic.entity';
import { TagEntity } from '@tag/entity/tag.entity';
import { TransactionTagHistory } from 'src/transaction-tag-history/entity/transaction-tag-history.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('tag-history')
export class TagHistory extends GenericEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  color: string;

  @Column()
  description: string;

  @Column({ name: 'user_creator_id' })
  userCreatorId: number;

  @OneToOne(() => TagEntity, (tag) => tag.tagHistory, { cascade: true })
  @JoinColumn({ name: 'tag_id' })
  tag: TagEntity;

  @OneToMany(
    () => TransactionTagHistory,
    (transactionTagHistory) => transactionTagHistory.tagHistory,
  )
  transactionTag: TransactionTagHistory[];
}

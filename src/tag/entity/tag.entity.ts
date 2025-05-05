import { GenericEntity } from '@shared/entity/Generic.entity';
import { TagHistory } from 'src/tag-history/entity/tag-history.entity';
import { TransactionTag } from 'src/transaction-tag/entity/transaction-tag.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('tag')
export class TagEntity extends GenericEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  color: string;

  @Column()
  description: string;

  @Column({ name: 'user_creator_id' })
  userCreatorId: number;

  @OneToMany(() => TransactionTag, (transactionTag) => transactionTag.tag)
  transactionTag: TransactionTag[];

  @OneToOne(() => TagHistory, (tagHistory) => tagHistory.tag)
  tagHistory: TagHistory;
}

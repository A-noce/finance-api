import { Null } from '@typing/generic';
import { DeleteDateColumn, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class GenericEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ default: new Date()})
  createdAt: Date;

  @UpdateDateColumn({ default: new Date()})
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Null<Date>
}
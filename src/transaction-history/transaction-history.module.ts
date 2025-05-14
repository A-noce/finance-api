import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionHistory } from './entity/transaction-history.entity';
import { TransactionHistoryService } from './services/transaction-history.service';
import { TransactionModule } from '@transaction/transaction.module';
import { UserModule } from '@user/user.module';
import { TransactionTagHistoryModule } from '@transaction-tag-history/transaction-tag-history.module';
import { TagHistoryModule } from '@tag-history/tag-history.module';
import { TransactionHistoryController } from './controller/transaction-history.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionHistory]),
    TransactionModule,
    TransactionTagHistoryModule,
    UserModule,
    TagHistoryModule
  ],
  controllers: [TransactionHistoryController],
  providers: [TransactionHistoryService],
})
export class TransactionHistoryModule {}

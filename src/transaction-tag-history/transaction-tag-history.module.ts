import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionTagHistory } from "./entity/transaction-tag-history.entity";
import { TransactionTagHistoryService } from "./service/transaction-tag.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionTagHistory])
  ],
  controllers: [],
  providers: [TransactionTagHistoryService],
})
export class TransactionTagHistoryModule {}

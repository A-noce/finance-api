import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionTag } from "./entity/transaction-tag.entity";
import { TransactionTagService } from "./service/transaction-tag.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionTag])
  ],
  controllers: [],
  providers: [TransactionTagService],
  exports: [TransactionTagService]
})
export class TransactionTagModule {}

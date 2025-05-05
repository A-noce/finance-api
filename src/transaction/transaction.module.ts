import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entity/transaction.entity";
import { TransactionService } from "./services/transaction.service";
import { TagModule } from "@tag/tag.module";
import { TransactionTagModule } from "@transaction-tag/transaction-tag.module";
import { TransactionController } from "./controller/transaction.controller";
import { UserModule } from "@user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    TagModule,
    TransactionTagModule,
    UserModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService]
})
export class TransactionModule {}

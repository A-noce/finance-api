import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagHistory } from "./entity/tag-history.entity";
import { TagHistoryService } from "./services/tag-history.service";
import { TagHistoryController } from "./controller/tag-history.controler";

@Module({
  imports: [
    TypeOrmModule.forFeature([TagHistory])
  ],
  controllers: [TagHistoryController],
  providers: [TagHistoryService],
  exports: [TagHistoryService]
})
export class TagHistoryModule {}

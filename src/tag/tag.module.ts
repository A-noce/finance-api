import { Module } from '@nestjs/common';
import { TagController } from './controller/tag.controller';
import { TagService } from './services/tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './entity/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity]),],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService]
})
export class TagModule {}

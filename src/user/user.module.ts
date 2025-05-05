import { Module } from '@nestjs/common';
import { UserService } from '@user/services/user.service';
import { User } from '@user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),],
  controllers: [],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}

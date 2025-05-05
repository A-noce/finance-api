import { AuthModule } from "@auth/auth.module";
import { appConfig } from "@config/data.config";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "@user/user.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TagModule } from "@tag/tag.module";
import { TagHistoryModule } from "@tag-history/tag-history.module";
import { TransactionModule } from "@transaction/transaction.module";
import { TransactionTagHistoryModule } from "./transaction-tag-history/transaction-tag-history.module";
import { TransactionHistoryModule } from "@transaction-history/transaction-history.module";
import { TransactionTagModule } from "@transaction-tag/transaction-tag.module";


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.getOrThrow('postgres.host'),
            port: config.getOrThrow('postgres.port'),
            username: config.getOrThrow('postgres.user'),
            password: config.getOrThrow('postgres.password'),
            database: config.getOrThrow('postgres.database'),
            synchronize: config.getOrThrow('application.nodeEnv') === 'development',
            autoLoadEntities: true
          }),
        }),
        UserModule,
        AuthModule,
        TagModule,
        TagHistoryModule,
        TransactionModule,
        TransactionHistoryModule,
        TransactionTagModule,
        TransactionTagHistoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

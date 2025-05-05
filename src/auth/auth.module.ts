import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '@auth/controller/auth.controller';
import { AuthService } from '@auth/services/auth.service';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (service: ConfigService) => ({
        secret: service.getOrThrow('jwt.secret'),
        signOptions: { expiresIn: `${service.getOrThrow('jwt.expiration')}h`, },
      }),
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

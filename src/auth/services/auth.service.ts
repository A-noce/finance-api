import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/services/user.service';
import { UserLoginRequestDTO } from '@auth/dtos/user-login-request.dto';
import { User } from '@user/entity/user.entity';
import { response, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly service: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async signUp({ email, password }: UserLoginRequestDTO) {
    const user = await this.service.findByEmail(email);
    if (user) {
      throw new BadRequestException('E-mail already used.');
    }

    const saltedPassword = await bcrypt.hash(password, 10);

    return await this.service.createUser(email, saltedPassword);
  }

  public async login(
    { email, password }: UserLoginRequestDTO,
    response: Response,
  ) {
    const user = await this.service.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    this.setCookie(user, response);
    return {
      email
    };
  }

  public async checkSession(request: Request) {
    const { email }: User = request['user']
    return { email }
  }

  public async logout(response: Response) {
    response.cookie('user_session', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      signed: true,
    });
  }

  private setCookie(user: User, response: Response) {
    response.cookie('user_session', JSON.stringify(user), {
      httpOnly: true,
      secure:
        this.configService.getOrThrow('application.nodeEnv') === 'production',
      maxAge: this.configService.getOrThrow('cookie.expiration'),
      signed: true,
    });
  }
}

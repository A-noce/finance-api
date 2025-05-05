import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/services/user.service';
import { UserLoginRequestDTO } from '@auth/dtos/user-login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly service: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async signUp({ email, password}: UserLoginRequestDTO) {
    const user = await this.service.findByEmail(email)
    if(user){
        throw new BadRequestException('E-mail already used.')
    }

    const saltedPassword = await bcrypt.hash(password, 10);

    return await this.service.createUser(email, saltedPassword)
  }

  public async singIn({ email, password}: UserLoginRequestDTO) {
    const user = await this.service.findByEmail(email)
    if(!user){
        throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials');
    }

    return {
        access_token: this.jwtService.sign({id:user.id, email: user.email}),
      };
  }

  public async checkSession() {
  }
}

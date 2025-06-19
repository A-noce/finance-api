import {
    Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserLoginRequestDTO } from '../dtos/user-login-request.dto';
import { JwtAuthGuard } from '@guards/jwt.guard';
import { TransformResponse } from 'src/interceptors/transform-response.interceptor';
import { UserResponseDTO } from '@auth/dtos/user-response.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/login')
  async login(@Body() body: UserLoginRequestDTO, @Res({ passthrough: true}) response: Response){
    return this.service.login(body, response)
  }

  @Post('/sign-up')
  @TransformResponse(UserResponseDTO)
  async signUp(@Body() body: UserLoginRequestDTO){
    return this.service.signUp(body)
  }

  @Get('/session')
  @UseGuards(JwtAuthGuard)
  async session(){
    return this.service.checkSession()
  }

  @Post('/logout')
  async logout(@Res() response: Response){
    return this.service.logout(response)
  }
}

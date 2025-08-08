import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserLoginRequestDTO } from '../dtos/user-login-request.dto';
import { TransformResponse } from 'src/interceptors/transform-response.interceptor';
import { UserResponseDTO } from '@auth/dtos/user-response.dto';
import { Response } from 'express';
import { AuthenticatedGuard } from '@guards/authenaticated.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/login')
  @TransformResponse(UserResponseDTO)
  async login(
    @Body() body: UserLoginRequestDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.service.login(body, response);
  }

  @Post('/sign-up')
  @TransformResponse(UserResponseDTO)
  async signUp(@Body() body: UserLoginRequestDTO) {
    return this.service.signUp(body);
  }

  @Get('/session')
  @UseGuards(AuthenticatedGuard)
  async session(@Req() request: Request) {
    return this.service.checkSession(request);
  }

  @Post('/logout')
  @TransformResponse(UserResponseDTO)
  async logout(@Res({ passthrough: true}) response: Response) {
    return this.service.logout(response);
  }
}

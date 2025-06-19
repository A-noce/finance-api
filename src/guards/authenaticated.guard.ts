import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const userSessionCookie = request.cookies['user_session'];

    if (!userSessionCookie) {
      throw new UnauthorizedException('No session cookie found.');
    }

    try {
      const userSession = JSON.parse(userSessionCookie);
      request['user'] = userSession; 
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid session cookie.');
    }
  }
}
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const signedUserSessionCookie = request.signedCookies['user_session'];

    if (!signedUserSessionCookie) {
      throw new UnauthorizedException('No session cookie found.');
    }

    try {
      const userSession = JSON.parse(signedUserSessionCookie);
      request['user'] = userSession; 
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid session cookie.');
    }
  }
}
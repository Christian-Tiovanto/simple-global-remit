import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';

@Injectable()
export class IsVerifyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;
    if (user.is_verified) return true;
    throw new UnauthorizedException('Unauthorized,please verify your account first');
  }
}

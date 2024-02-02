// jwt-auth.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtFromHeader(request);

    if (!token) {
      return false;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload;
      return true;
    } catch (error) {
      return false;
    }
  }

  private extractJwtFromHeader(request: any): string {
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const [bearer, token] = authHeader.split(' ');
      if (bearer.toLowerCase() === 'bearer' && token) {
        return token;
      }
    }
    return null;
  }
}

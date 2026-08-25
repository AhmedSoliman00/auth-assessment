import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from './access-token.strategy';

export interface RefreshJwtPayload extends JwtPayload {
  refreshToken: string;
}

interface RequestWithCookies extends Request {
  cookies: Record<string, string | undefined>;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          (req as unknown as RequestWithCookies)?.cookies?.['refresh_token'] ||
          null,
      ]),
      secretOrKey: configService.get<string>('jwt.refreshSecret')!,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): RefreshJwtPayload {
    const cookies = (req as unknown as RequestWithCookies).cookies;
    const refreshToken = cookies?.['refresh_token'] || '';
    return { ...payload, refreshToken };
  }
}

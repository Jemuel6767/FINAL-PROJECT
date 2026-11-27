import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './auth.types.js';
import { UsersService } from '../users/users.service.js';
import { TokenRevocationService } from './token-revocation.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private readonly usersService: UsersService, private readonly tokenRevocation: TokenRevocationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
      issuer: config.get<string>('JWT_ISSUER', 'studyhub-api'),
      audience: config.get<string>('JWT_AUDIENCE', 'studyhub-web'),
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.jti || await this.tokenRevocation.isRevoked(payload.jti)) throw new UnauthorizedException('Session has ended. Please log in again.');
    return this.usersService.findById(payload.sub);
  }
}

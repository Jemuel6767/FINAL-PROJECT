import { UserRole } from '../common/enums/user-role.enum.js';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
  jti: string;
  iat: number;
  exp: number;
}

import { UserRole } from '../../../generated/prisma/enums';

export interface JwtPayload {
  id: string;
  role: UserRole;
}

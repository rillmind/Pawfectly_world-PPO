import { Role } from "../enum/roles.enum";

export interface JwtPayload {
  sub: string;
  nome: string;
  role: Role;
}

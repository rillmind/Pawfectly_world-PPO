import { UseGuards, applyDecorators } from "@nestjs/common";
import { Role } from "../enum/roles.enum";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "../guard/roles.guard";
import { JwtAuthGuard } from "../guard/jwt.auth.guard";

export function JwtAuth(...roles: Role[]) {
  return applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard));
}

import { SetMetadata } from "@nestjs/common";

export const JwtAuth = (...args: string[]) => SetMetadata("jwt.auth", args);

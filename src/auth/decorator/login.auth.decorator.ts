import { applyDecorators, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "../guard/local.auth.guar";

export function LoginAuth() {
  return applyDecorators(UseGuards(LocalAuthGuard));
}
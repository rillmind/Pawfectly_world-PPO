import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email_ou_username",
      passwordField: "senha",
    });
  }

  async validate(email_ou_username: string, senha: string) {
    const user = await this.authService.login({
      email_ou_username,
      senha,
    });
    if (!user) throw new UnauthorizedException("Incorrect CPF or Password!");
    return user;
  }
}

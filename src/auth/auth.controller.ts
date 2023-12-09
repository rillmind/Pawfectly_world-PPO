import {
  Req,
  Get,
  Res,
  Body,
  Post,
  HttpCode,
  Controller,
  HttpStatus,
} from "@nestjs/common";
import { Public } from "./decorator/public.auth.decorator";
import { JwtAuth } from "./decorator/jwt.auth.decorator";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { Post_schema_login } from "./dto/login.dto";

@Controller("auth")
@JwtAuth()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() post_schema_login: Post_schema_login,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ id: any; nome: string; email_ou_username: string }> {
    const authResult = await this.authService.login(post_schema_login);
    res.set("Authorization", authResult.token);
    res.set("Access-Control-Expose_headers", "Authorization");
    const { token, ...body } = authResult;
    return body;
  }

  @Get()
  public async getProfile(@Req() req) {
    const profile = await this.authService.getById(req.user.id);
    return profile;
  }
}

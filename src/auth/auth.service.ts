import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { User } from "src/user/schemas/user.schemas";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Post_schema_login } from "./dto/login.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  public async login(post_schema_login: Post_schema_login): Promise<{
    id: any;
    nome: string;
    token: string;
    email_ou_username: string;
  }> {
    const { email_ou_username, senha } = post_schema_login;
    if (!email_ou_username || !senha) {
      throw new UnprocessableEntityException(
        "Todos os campos precisam ser preenchidos!"
      );
    }
    const user = await this.userModel.findOne({
      $or: [{ email: email_ou_username }, { username: email_ou_username }],
    });
    if (!user) {
      throw new UnauthorizedException("Email, username ou senha inválidos");
    }
    const isPasswordMatched = await bcrypt.compare(senha, user.senha);
    if (!isPasswordMatched) {
      throw new UnauthorizedException("Email, username ou senha inválidos");
    }
    const { token } = this.generateToken({
      id: user._id,
      nome: user.nome,
      role: user.role,
    });
    return { id: user._id, nome: user.nome, email_ou_username, token };
  }

  generateToken(user: any) {
    if (!user) {
      throw new Error("User is undefined");
    }
    const token = this.jwtService.sign({
      sub: user.id,
      nome: user.nome,
      role: user.role,
    });
    return { token };
  }
}

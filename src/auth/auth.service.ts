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
    @InjectModel("User")
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    loginDto: Post_schema_login
  ): Promise<{ name: string; id: any; email: string; role: string }> {
    const { email_ou_username, senha } = loginDto;
    const login = await this.userModel.findOne({ email_ou_username });
    if (senha.length < 6) {
      throw new UnprocessableEntityException("Validation Problem.");
    }
    if (!login || !(await bcrypt.compare(senha, login.senha))) {
      throw new UnauthorizedException("Incorrect username, email or Password!");
    }
    return {
      id: login._id,
      name: login.nome,
      email: login.email,
      role: login.role,
    };
  }

  generateToken(user: any) {
    const token = this.jwtService.sign({
      sub: user.id,
      nome: user.nome,
      role: user.role,
    });
    return { token };
  }
}

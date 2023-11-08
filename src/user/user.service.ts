import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { User } from "./schemas/user.schemas";
import { Role } from "src/auth/enum/roles.enum";
import { Model } from "mongoose";
import { Request } from "express";
import { JwtPayload } from "./jwt/jwt-payload.model";
import { InjectModel } from "@nestjs/mongoose";
import { AuthService } from "src/auth/auth.service";
import { Post_schema_user } from "./dto/user.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
  jwtService: any;
  constructor(
    @InjectModel("User")
    private userModel: Model<User>,
    private authService: AuthService
  ) {}

  public async signup(post_schema_user: Post_schema_user): Promise<{
    id: any;
    nome: string;
    email: string;
    token: string;
    username: string;
  }> {
    const { nome, email, username, senha } = post_schema_user;
    const hashedPassword = await bcrypt.hash(senha, 10);
    if (!nome || !username || !email || !senha) {
      throw new UnprocessableEntityException(
        "Todos os campos precisam ser preenchidos!"
      );
    }
    if (senha.length < 6) {
      throw new UnprocessableEntityException(
        "A senha deve ter pelo menos 6 caracteres"
      );
    }
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      throw new ConflictException("Email ou username já existentes!");
    }
    const user = await this.userModel.create({
      nome,
      email,
      username,
      senha: hashedPassword,
      role: Role.USER,
    });
    if (!user) {
      throw new NotFoundException("User not found.");
    }
    const { token } = this.authService.generateToken({
      id: user._id,
      name: user.nome,
      role: user.role,
    });
    return { token, id: user._id, nome, email, username };
  }

  public async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  public async findById(id: string): Promise<User> {
    try {
      const document = await this.userModel.findById(id).exec();
      if (!document) {
        throw new NotFoundException(`Document com ID ${id} não encontrado!`);
      }
      return document;
    } catch (error) {
      throw new NotFoundException(`Document com ID ${id} não encontrado!`);
    }
  }

  public async patchById(
    id: string,
    partialUpdate: Partial<User>
  ): Promise<User> {
    const document = await this.findById(id);
    if (!document) {
      throw new NotFoundException(`Document com ID ${id} não encontrado!`);
    }
    Object.assign(document, partialUpdate);
    const updatedDocument = await document.save();
    return updatedDocument;
  }

  public async deleteById(id: string): Promise<User> {
    const document = await this.findById(id);
    if (!document) {
      throw new NotFoundException(`Document com ID ${id} não encontrado!`);
    }
    const deletedDocument = await this.userModel.findByIdAndRemove(id).exec();
    return deletedDocument;
  }

  private static jwtExtractor(request: Request): string {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new BadRequestException("Token inválido ou inexistente!");
    }
    const [, token] = authHeader.split(" ");
    return token;
  }

  public returnJwtExtractor(): (request: Request) => string {
    return UserService.jwtExtractor;
  }

  public async validateUser(jwtPayload: JwtPayload): Promise<User> {
    const user = await this.userModel.findOne({ _id: jwtPayload.userId });
    if (!user) {
      throw new UnauthorizedException("User not found.");
    }
    return user;
  }
}

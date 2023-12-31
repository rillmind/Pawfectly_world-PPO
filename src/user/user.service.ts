import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { User } from "./schemas/user.schemas";
import { Role } from "src/auth/enum/roles.enum";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AuthService } from "src/auth/auth.service";
import { Post_schema_user } from "./dto/user.signup.dto";
import * as bcrypt from "bcryptjs";
import { Patch_schema_user } from "./dto/user.update.dto";

@Injectable()
export class UserService {
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
      username: user.username,
      name: user.nome,
      role: user.role,
    });
    return { token, id: user._id, nome, email, username };
  }

  public async findAll(): Promise<User[]> {
    return this.userModel.find().sort({ createdAt: -1 }).limit(10).exec();
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

  async findByIndex(index: number): Promise<User | null> {
    return this.userModel
      .findOne()
      .skip(index - 1)
      .exec();
  }

  public async patchById(
    id: string,
    patch_schema_user: Patch_schema_user
  ): Promise<User> {
    const document = await this.findById(id);
    if (!document) {
      throw new NotFoundException(`Document com ID ${id} não encontrado!`);
    }
    Object.assign(document, patch_schema_user);
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

  async deleteByIndex(index: number): Promise<User | null> {
    const user = await this.userModel
      .findOne()
      .skip(index - 1)
      .exec();
    if (!user) {
      return null;
    }
    await user.deleteOne();
    return user;
  }
}

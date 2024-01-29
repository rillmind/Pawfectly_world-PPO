import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { Model } from "mongoose";
import { AuthService } from "src/auth/auth.service";
import { Role } from "src/auth/enum/roles.enum";
import {
  Patch_schema_user,
  Patch_schema_user_data,
  Patch_schema_user_pass,
  Post_schema_user,
} from "./dto/user.dto";
import { User } from "./schemas/user.schemas";
import { createClient } from "@supabase/supabase-js";

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
    if (!user) throw new NotFoundException("Usário não encontrado.");
    const { token } = this.authService.generateToken({
      id: user._id,
      username: user.username,
      name: user.nome,
      role: user.role,
    });
    return { token, id: user._id, nome, email, username };
  }

  public async find(cursor: Date, pageSize: number = 10): Promise<User[]> {
    return this.userModel
      .find({ createdAt: { $lt: cursor } }) // Busca itens criados antes do cursor
      .sort({ createdAt: -1 }) // Ordena do mais recente para o mais antigo
      .limit(pageSize) // Limita o número de itens retornados
      .exec();
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException("Usuário não encontrado");
    return user;
  }

  async findByIndex(index: number): Promise<User | null> {
    return this.userModel
      .findOne()
      .skip(index - 1)
      .exec();
  }

  public async getPicByUserId(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException("Usuário não encontrado");
    return user.foto_de_perfil;
  }

  public async patchUserPicById(id: string, file): Promise<User> {
    // Fazendo o upload da imagem para o Supabase
    const imageUrl = await this.uploadToSupabase(file);

    // Encontrando e atualizando o usuário
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }
    user.foto_de_perfil = imageUrl;
    await user.save();
    return user;
  }

  private async uploadToSupabase(file) {
    const supabaseURL = process.env.SUPABASE_URL;
    const supabaseKEY = process.env.SUPABASE_KEY;
    const supabase = createClient(supabaseURL, supabaseKEY);
    const uploadPath = `profilePic/${file.originalname}`;
    const { error, data } = await supabase.storage
      .from("profilePic")
      .upload(uploadPath, file.buffer, {
        upsert: true,
      });
    if (error) throw new Error("Erro no upload da imagem");
    return `${supabaseURL}/storage/v1/object/public/profilePic/${uploadPath}`;
  }

  public async patchUserById(
    id: string,
    patch_schema_user: Patch_schema_user
  ): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException("Usuário não encontrado");
    Object.assign(user, patch_schema_user);
    const updatedUser = await user.save();
    return updatedUser;
  }

  public async patchUserDataById(
    id: string,
    patch_schema_user_data: Patch_schema_user_data
  ): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException("Usuário não encontrado");
    Object.assign(user, patch_schema_user_data);
    const updatedUser = await user.save();
    return updatedUser;
  }

  public async patchUserPassById(
    id: string,
    patch_schema_user_pass: Patch_schema_user_pass
  ): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException("Usuário não encontrado");
    if (patch_schema_user_pass.senha) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(
        patch_schema_user_pass.senha,
        salt
      );
      patch_schema_user_pass.senha = hashedPassword;
    }
    Object.assign(user, patch_schema_user_pass);
    const updatedUser = await user.save();
    return updatedUser;
  }

  public async deleteById(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException("Usuário não encontrado");
    await this.userModel.findByIdAndRemove(id).exec();
    return user;
  }

  async deleteByIndex(index: number) {
    const user = await this.userModel
      .findOne()
      .skip(index - 1)
      .exec();
    if (!user) throw new NotFoundException("Usuário não encontrado");
    await user.deleteOne();
    return user;
  }
}

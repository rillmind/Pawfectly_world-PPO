import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/schemas/user.schemas";
import { Post_schema_post } from "./dto/post.dto";
import { Posts } from "./schemas/post.schema";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class PostService {
  constructor(
    @InjectModel("Post")
    private postModel: Model<Posts>,
    @InjectModel("User")
    private userModel: Model<User>
  ) {}

  public async find(): Promise<Posts[]> {
    return await this.postModel.find().sort({ createdAt: -1 });
  }

  public async createPost(
    post_schema_post: Post_schema_post,
    userSub: string,
    // filePath: string
  ) {
    const { descricao, img, pet, like } = post_schema_post;
    const id = await this.userModel.findById(userSub);
    const post = await this.postModel.create({
      pet,
      like,
      user: id,
      descricao,
      nome: id.nome,
      img,
      username: id.username,
    });
    if (!post) throw new BadRequestException();
    return {
      _id: post._id,
      user: id.id,
      nome: id.nome,
      username: id.username,
      pet,
      descricao: post.descricao,
    };
  }

  public async getPicByPostId(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException("Usuário não encontrado");
    return user.foto_de_perfil;
  }

  public async patchPostPicById(id: string, file){
    const imageUrl = await this.uploadToSupabase(file);
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException("Usuário não encontrado");
    }
    post.img = imageUrl;
    await post.save();
    return post;
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

  public async patchImgByPostId(id: string, file) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException();
    post.img = file.filename;
    await post.save();
    return post;
  }

  public async findAllByOwner(userId: string): Promise<Posts[]> {
    return await this.postModel.find({
      user: userId,
    }).sort({ createdAt: -1 });
  }

  public async findAllByPetId(petId: string): Promise<Posts[]> {
    return await this.postModel.find({
      pet: petId,
    }).sort({ createdAt: -1 });
  }

  public async findById(id: string) {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException("Post não encontrado.");
    return post;
  }

  public async deletePostById(postId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException("Post não encontrado.");
    await this.postModel.findByIdAndRemove(postId).exec();
  }
}

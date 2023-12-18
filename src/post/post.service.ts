import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/schemas/user.schemas";
import { Post_schema_post } from "./dto/post.dto";
import { Posts } from "./schemas/post.schema";

@Injectable()
export class PostService {
  constructor(
    @InjectModel("Post")
    private postModel: Model<Posts>,
    @InjectModel("User")
    private userModel: Model<User>
  ) {}

  public async find(): Promise<Posts[]> {
    return await this.postModel.find();
  }

  public async createPost(post_schema_post: Post_schema_post, userId: string) {
    const { descricao, img, pet, like } = post_schema_post;
    const id = await this.userModel.findById(userId);
    const post = await this.postModel.create({
      img,
      pet,
      like,
      user: id,
      descricao,
    });
    if (!post) throw new BadRequestException();
    return post;
  }

  public async findAllByOwner(userId: string): Promise<Posts[]> {
    return await this.postModel.find({
      usuario: userId,
    });
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

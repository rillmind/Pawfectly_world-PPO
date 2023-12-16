import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post } from "./schemas/post.schema";
import { Model } from "mongoose";
import { Post_schema_post } from "./dto/post.dto";
import { User } from "src/user/schemas/user.schemas";
import { Animal } from "src/animal/schemas/animal.schemas";

@Injectable()
export class PostService {
  constructor(
    @InjectModel("Post")
    private postModel: Model<Post>,
    @InjectModel("Animal")
    private animalModel: Model<Animal>,
    @InjectModel("User")
    private userModel: Model<User>
  ) {}

  public async find(): Promise<Post[]> {
    return await this.postModel.find().sort({ createdAt: -1 }).limit(10).exec();
  }

  public async createPost(post_schema_post: Post_schema_post, userId: string) {
    const { descricao, img } = post_schema_post;
    const id = await this.userModel.findById(userId);
    const post = await this.postModel.create({
      img,
      user: id,
      descricao,
    });
    if (!post) throw new NotFoundException();
    return post;
  }

  public async deletePostById(userId: string, postId: string) {
    const user = await this.userModel.findById(userId);
    const post = await this.postModel.findById(postId);
    if (!post || !user) throw new NotFoundException();
    await this.postModel.findByIdAndRemove(postId).exec();
  }
}

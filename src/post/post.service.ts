import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { Post_schema_post } from './dto/post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectModel("Post")
        private postModel: Model<Post>,
    ) {}

    public async find(): Promise<Post[]> {
        return await this.postModel.find().sort({ createdAt: -1 }).limit(10).exec();
    }

    public async createPost(post_schema_post: Post_schema_post): Promise<{ descricao: string, img: any }> {
        const { descricao, img } = post_schema_post;
        const document = await this.postModel.create({
            descricao,
            img
        });
        if (!document) throw new NotFoundException();
        return { descricao, img }
    }
}

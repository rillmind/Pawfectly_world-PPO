import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { PostSchema } from "./schemas/post.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { AnimalSchema } from "src/animal/schemas/animal.schemas";
import { UserSchema } from "src/user/schemas/user.schemas";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Animal", schema: AnimalSchema }]),
    MongooseModule.forFeature([{ name: "Post", schema: PostSchema }]),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
  ],

  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}

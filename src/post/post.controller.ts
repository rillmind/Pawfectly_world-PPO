import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from "@nestjs/common";
import { Post_schema_animal } from "src/animal/DTOs/animal.dto";
import { AnimalService } from "src/animal/animal.service";
import { JwtAuth } from "src/auth/decorator/jwt.auth.decorator";
import { OwnerChecker } from "src/auth/decorator/ownership.checker.decorator";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "src/auth/enum/roles.enum";
import { UserOwnershipChecker } from "src/user/owner/user.ownershup.checker";
import { Post_schema_post } from "./dto/post.dto";
import { User } from "src/user/schemas/user.schemas";
import { PostService } from "./post.service";

@Controller("post")
@JwtAuth()
@OwnerChecker(UserOwnershipChecker)
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  public async signUp(@Body() post_schema_post: Post_schema_post, @Req() req) {
    const userId = req.user.id;
    const post = await this.postService.createPost(post_schema_post, userId);
    return post;
  }

  @Delete(":id")
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removePostById(@Req() req, @Param("id") postSub) {
    const userId = req.user.id;
    const postId = postSub;
    await this.postService.deletePostById(userId, postId);
  }
}

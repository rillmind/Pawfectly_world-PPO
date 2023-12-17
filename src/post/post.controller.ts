import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from "@nestjs/common";
import { JwtAuth } from "src/auth/decorator/jwt.auth.decorator";
import { OwnerChecker } from "src/auth/decorator/ownership.checker.decorator";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "src/auth/enum/roles.enum";
import { UserOwnershipChecker } from "src/user/owner/user.ownershup.checker";
import { Post_schema_post } from "./dto/post.dto";
import { PostService } from "./post.service";

@Controller("post")
@JwtAuth()
@OwnerChecker(UserOwnershipChecker)
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER, Role.ADMIN)
  public async find() {
    return this.postService.find();
  }

  @Post()
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  public async signUp(@Body() post_schema_post: Post_schema_post, @Req() req) {
    const userId = req.user.id;
    const post = await this.postService.createPost(post_schema_post, userId);
    return post;
  }
  
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER, Role.ADMIN)
  public async findById(@Param("id") postId) {
    return await this.postService.findById(postId)
  }

  @Delete(":id")
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removePostById(@Param("id") postId) {
    await this.postService.deletePostById(postId);
  }
}

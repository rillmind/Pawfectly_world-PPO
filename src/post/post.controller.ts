import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuth } from "src/auth/decorator/jwt.auth.decorator";
import { OwnerChecker } from "src/auth/decorator/ownership.checker.decorator";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "src/auth/enum/roles.enum";
import { multerConfig } from "src/post/multer/multer.config";
import { UserOwnershipChecker } from "src/user/owner/user.ownershup.checker";
import { Post_schema_post } from "./dto/post.dto";
import { PostService } from "./post.service";
import { Posts } from "./schemas/post.schema";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("post")
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
    return await this.postService.createPost(post_schema_post, userId);
  }

  @Patch("postImg/:id")
  @UseInterceptors(FileInterceptor("file", multerConfig))
  public async pathcPostImgByPostId(
    @Param("id") postId: string,
    @UploadedFile() file
  ) {
    if (!file) throw new NotFoundException("Nenhum arquivo enviado.");
    return await this.postService.patchImgByPostId(postId, file);
  }

  @Get("myposts")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER, Role.ADMIN)
  public async findAllByOwner(@Req() req): Promise<Posts[]> {
    const userId = req.user.id;
    return this.postService.findAllByOwner(userId);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER, Role.ADMIN)
  public async findById(@Param("id") postId) {
    return await this.postService.findById(postId);
  }

  @Delete(":id")
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removePostById(@Param("id") postId) {
    await this.postService.deletePostById(postId);
  }

  @Get("others/:id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER, Role.ADMIN)
  public async othersPosts(@Param("id") userId: string) {
    return await this.postService.findAllByOwner(userId);
  }

  @Get("petposts/:id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER, Role.ADMIN)
  public async findAllByPetId(@Param("id") petId): Promise<Posts[]> {
    return this.postService.findAllByPetId(petId);
  }
}

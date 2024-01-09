import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { Types } from "mongoose";
import { JwtAuth } from "src/auth/decorator/jwt.auth.decorator";
import { OwnerChecker } from "src/auth/decorator/ownership.checker.decorator";
import { Public } from "src/auth/decorator/public.auth.decorator";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "src/auth/enum/roles.enum";
import { multerConfig } from "src/user/multer/multer.config";
import {
  Patch_schema_user,
  Patch_schema_user_data,
  Patch_schema_user_pass,
  Post_schema_user,
} from "./dto/user.dto";
import { UserOwnershipChecker } from "./owner/user.ownershup.checker";
import { UserService } from "./user.service";

@ApiTags("user")
@Controller("user")
@JwtAuth()
@OwnerChecker(UserOwnershipChecker)
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Header("Access-Control-Expose-Headers", "Authorization")
  public async create(
    @Body() post_schema_user: Post_schema_user,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.userService.signup(post_schema_user);
    res.set("Authorization", user.token);
    const { token, ...body } = user;
    return body;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.USER)
  public async find(
    @Query("cursor") cursor: string,
    @Query("pageSize") pageSize: string
  ) {
    const pageSizeNumber = parseInt(pageSize, 10) || 10;
    const cursorDate = cursor ? new Date(cursor) : new Date();
    return await this.userService.find(cursorDate, pageSizeNumber);
  }

  @Post("pic/:id")
  @UseInterceptors(FileInterceptor("file", multerConfig))
  async updateUserPicById(@Param("id") userId: string, @UploadedFile() file) {
    if (!file) throw new NotFoundException("Nenhum arquivo enviado.");
    return this.userService.patchUserPicById(userId, file);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.USER)
  async getUser(@Param("id") param: string) {
    if (Types.ObjectId.isValid(param)) {
      const user = await this.userService.findById(param);
      if (!user) throw new NotFoundException("Usário não encontrado.");
      return user;
    } else {
      const index = parseInt(param, 10);
      if (isNaN(index) || index < 1) {
        throw new BadRequestException("Invalid index");
      }
      const user = await this.userService.findByIndex(index);
      if (!user) throw new NotFoundException("Usário não encontrado.");
      return user;
    }
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async patchUserById(
    @Param("id") id: string,
    @Body() patch_schema_user: Patch_schema_user
  ) {
    return await this.userService.patchUserById(id, patch_schema_user);
  }

  @Patch("data/:id")
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async patchUserDataById(
    @Param("id") id: string,
    @Body() patch_schema_user_data: Patch_schema_user_data
  ) {
    return await this.userService.patchUserDataById(id, patch_schema_user_data);
  }

  @Patch("pass/:id")
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async patchUserPassById(
    @Param("id") id: string,
    @Body() patch_schema_user_pass: Patch_schema_user_pass
  ) {
    return await this.userService.patchUserPassById(id, patch_schema_user_pass);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id") param: string) {
    if (Types.ObjectId.isValid(param)) {
      const deletedUser = await this.userService.deleteById(param);
      if (!deletedUser) throw new NotFoundException("Usário não encontrado.");
    } else {
      const index = parseInt(param, 10);
      if (isNaN(index) || index < 1) {
        throw new BadRequestException("Index inválido");
      }
      const deletedUser = await this.userService.deleteByIndex(index);
      if (!deletedUser) throw new NotFoundException("Usário não encontrado.");
    }
  }
}

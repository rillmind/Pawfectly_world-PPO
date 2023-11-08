import {
  Res,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Controller,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { User } from "./schemas/user.schemas";
import { Role } from "src/auth/enum/roles.enum";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Public } from "src/auth/decorator/public.auth.decorator";
import { JwtAuth } from "src/auth/decorator/jwt.auth.decorator";
import { Response } from "express";
import { UserService } from "./user.service";
import { OwnerChecker } from "src/auth/decorator/ownership.checker.decorator";
import { Post_schema_user } from "./dto/user.dto";
import { UserOwnershipChecker } from "./owner/user.ownershup.checker";

@Controller("user")
@JwtAuth()
@OwnerChecker(UserOwnershipChecker)
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
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
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  public async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  public async findById(@Param("id") id: string) {
    try {
      const document = await this.userService.findById(id);
      return document;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Patch(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async patchById(
    @Param("id") id: string,
    @Body() partialUpdate: Partial<User>
  ) {
    try {
      const updatedDocument = await this.userService.patchById(
        id,
        partialUpdate
      );
      return updatedDocument;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteById(@Param("id") id: string) {
    try {
      const deletedDocument = await this.userService.deleteById(id);
      return deletedDocument;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}

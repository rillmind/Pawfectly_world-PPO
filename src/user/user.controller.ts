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
  BadRequestException,
} from "@nestjs/common";
import { User } from "./schemas/user.schemas";
import { Role } from "src/auth/enum/roles.enum";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Types } from "mongoose";
import { Public } from "src/auth/decorator/public.auth.decorator";
import { JwtAuth } from "src/auth/decorator/jwt.auth.decorator";
import { Response } from "express";
import { UserService } from "./user.service";
import { OwnerChecker } from "src/auth/decorator/ownership.checker.decorator";
import { Post_schema_user } from "./dto/user.signup.dto";
import { UserOwnershipChecker } from "./owner/user.ownershup.checker";
import { Patch_schema_user } from "./dto/user.update.dto";

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
  @Roles(Role.ADMIN, Role.OWNER)
  async getUser(@Param("id") param: string) {
    if (Types.ObjectId.isValid(param)) {
      const user = await this.userService.findById(param);
      if (!user) {
        throw new NotFoundException(`User not found.`);
      }
      return user;
    } else {
      const index = parseInt(param, 10);
      if (isNaN(index) || index < 1) {
        throw new BadRequestException("Invalid index");
      }
      const user = await this.userService.findByIndex(index);
      if (!user) {
        throw new NotFoundException(`User not found.`);
      }
      return user;
    }
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.OWNER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async patchById(
    @Param("id") id: string,
    @Body() patch_schema_user: Patch_schema_user
  ) {
    try {
      const updatedDocument = await this.userService.patchById(
        id,
        patch_schema_user
      );
      return updatedDocument;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.OWNER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id") param: string) {
    if (Types.ObjectId.isValid(param)) {
      const deletedDocument = await this.userService.deleteById(param);
      if (!deletedDocument) {
        throw new NotFoundException(`User not found.`);
      }
    } else {
      const index = parseInt(param, 10);
      if (isNaN(index) || index < 1) {
        throw new BadRequestException("Index inválido");
      }
      const deletedDocument = await this.userService.deleteByIndex(index);
      if (!deletedDocument) {
        throw new NotFoundException(`User not found.`);
      }
    }
  }
}

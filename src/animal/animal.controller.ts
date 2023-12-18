import {
  Get,
  Req,
  Body,
  Post,
  Param,
  Patch,
  Delete,
  HttpCode,
  Controller,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Role } from "src/auth/enum/roles.enum";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Types } from "mongoose";
import { Animal } from "./schemas/animal.schemas";
import { JwtAuth } from "src/auth/decorator/jwt.auth.decorator";
import { OwnerChecker } from "src/auth/decorator/ownership.checker.decorator";
import { AnimalService } from "./animal.service";
import { Post_schema_animal } from "./DTOs/animal.dto";
import { UserOwnershipChecker } from "src/user/owner/user.ownershup.checker";

@Controller("animal")
@JwtAuth()
@OwnerChecker(UserOwnershipChecker)
export class AnimalController {
  constructor(private animalService: AnimalService) {}

  @Post()
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  public async signUp(
    @Body() post_schema_animal: Post_schema_animal,
    @Req() req
  ): Promise<{ id: any; nome: string; adocao: any; dono: any }> {
    const userId = req.user.id;
    const animal = await this.animalService.createAnimal(
      post_schema_animal,
      userId
    );
    return {
      id: animal.id,
      nome: animal.nome,
      adocao: animal.adocao,
      dono: userId,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.USER)
  public async findAll(): Promise<Animal[]> {
    return this.animalService.findAll();
  }

  @Get("mypets")
  @Roles(Role.USER, Role.ADMIN)
  public async findAllByOwner(@Req() req): Promise<Animal[]> {
    const userId = req.user.id;
    return this.animalService.findAllByOwner(userId);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  public async findById(
    @Param("id") id: string
  ): Promise<{ nome: string; id: any }> {
    const document = await this.animalService.findById(id);
    return { id: document.id, nome: document.nome };
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  public async patchById(
    @Param("id") id: string,
    @Body() partialUpdate: Partial<Animal>
  ) {
    try {
      const updatedDocument = await this.animalService.patchById(
        id,
        partialUpdate
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
      const deletedDocument = await this.animalService.deleteById(param);
      if (!deletedDocument) {
        throw new NotFoundException(`Animal not found.`);
      }
    } else {
      const index = parseInt(param, 10);
      if (isNaN(index) || index < 1) {
        throw new BadRequestException("Index inválido");
      }
      const deletedDocument = await this.animalService.deleteByIndex(index);
      if (!deletedDocument) {
        throw new NotFoundException(`Animal not found.`);
      }
    }
  }
}

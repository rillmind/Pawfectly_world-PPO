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
import { Patch_schema_animal, Post_schema_animal } from "./dto/animal.dto";
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
      userId,
      post_schema_animal
    );
    return {
      id: animal.id,
      nome: animal.nome,
      dono: userId,
      adocao: animal.adocao,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.USER)
  public async findAll(): Promise<Animal[]> {
    return this.animalService.findAll();
  }

  @Get("mypets")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER, Role.ADMIN)
  public async findAllByOwner(@Req() req): Promise<Animal[]> {
    const userId = req.user.id;
    return this.animalService.findAllByOwner(userId);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.USER)
  public async findById(@Param("id") id: string) {
    return await this.animalService.findById(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.USER)
  public async patchById(
    @Param("id") id: string,
    @Body() patch_schema_animal: Patch_schema_animal
  ) {
    const updatedAnimal = await this.animalService.patchById(
      id,
      patch_schema_animal
    );
    if (!updatedAnimal) throw new NotFoundException("Pet não encontrado");
    return updatedAnimal;
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id") param: string) {
    if (Types.ObjectId.isValid(param)) {
      const deletedAnimal = await this.animalService.deleteById(param);
      if (!deletedAnimal) throw new NotFoundException("Pet não encontrado");
    } else {
      const index = parseInt(param, 10);
      if (isNaN(index) || index < 1) {
        throw new BadRequestException("Index inválido");
      }
      const deletedAnimal = await this.animalService.deleteByIndex(index);
      if (!deletedAnimal) throw new NotFoundException("Pet não encontrado");
    }
  }
}

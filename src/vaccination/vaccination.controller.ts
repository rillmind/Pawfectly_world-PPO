import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { VaccinationService } from "./vaccination.service";
import { Post_schema_vacina } from "./dto/vaccination.dto";
import { Animal } from "src/animal/schemas/animal.schemas";
import { JwtAuth } from "src/auth/decorator/jwt.auth.decorator";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "src/auth/enum/roles.enum";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("vaccination")
@Controller("vaccination")
@JwtAuth()
export class VaccinationController {
  constructor(private readonly vaccinationService: VaccinationService) {}

  @Post(":id")
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  public async createVacina(
    @Body() post_schema_vacina: Post_schema_vacina,
    @Param("id") petId: Animal
  ) {
    const vacina = await this.vaccinationService.createVacina(
      post_schema_vacina,
      petId
    );
    return {
      id: vacina._id,
      data: vacina.data,
      revacinacao: vacina.revacinacao,
      vacina: vacina.vacina,
      nota: vacina.nota,
    };
  }

  @Get("vacina/:id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER, Role.ADMIN)
  public async findVacinaById(@Param("id") vacinaId) {
    return await this.vaccinationService.findVacinaById(vacinaId);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER, Role.ADMIN)
  public async findVacinaByPetId(@Param("id") petId: Animal) {
   return await this.vaccinationService.findVacinaByPetId(petId);
  }

  @Delete(":id")
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteVacinaById(@Param("id") vacinaId) {
    await this.vaccinationService.deleteVacinaById(vacinaId);
  }
}

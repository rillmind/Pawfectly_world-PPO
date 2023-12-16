import { Body, Controller, Param, Patch, Post, Req } from "@nestjs/common";
import { AdoptionService } from "./adoption.service";
import { JwtAuth } from "src/auth/decorator/jwt.auth.decorator";
import { Post_schema_adoption } from "./dto/adoption.dto";
import { AnimalService } from "src/animal/animal.service";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "src/auth/enum/roles.enum";
import { User } from "src/user/schemas/user.schemas";

@Controller("adoption")
@JwtAuth()
export class AdoptionController {
  constructor(
    private adoptionService: AdoptionService,
    private animalService: AnimalService
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  public async toAdopt(
    @Body() post_schema_adoption: Post_schema_adoption,
    @Req() req
  ) {
    const adopterId = req.user.id;
    const adoption = await this.adoptionService.toAdopt(
      post_schema_adoption,
      adopterId
    );
    return adoption;
  }

  @Patch(":id")
  public async toAccept(@Param("id") adoptionId: string) {
    const petUpdated = await this.adoptionService.toAccept(adoptionId);
    return petUpdated;
  }
}

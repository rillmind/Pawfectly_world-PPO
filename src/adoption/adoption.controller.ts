import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { JwtAuth } from "src/auth/decorator/jwt.auth.decorator";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "src/auth/enum/roles.enum";
import { AdoptionService } from "./adoption.service";
import { Post_schema_adoption } from "./dto/adoption.dto";
import { Adoption } from "./schema/adoption.schema";

@Controller("adoption")
@JwtAuth()
export class AdoptionController {
  constructor(private adoptionService: AdoptionService) {}

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  public async find() {
    return this.adoptionService.find();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER, Role.ADMIN)
  public async toAdopt(
    @Req() req,
    @Body() post_schema_adoption: Post_schema_adoption
  ) {
    const adopterId = req.user.id;
    const adoption = await this.adoptionService.toAdopt(
      post_schema_adoption,
      adopterId
    );
    return adoption;
  }

  @Get("my")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER, Role.ADMIN)
  public async findAllByOwner(@Req() req): Promise<Adoption> {
    const userId = req.user.id;
    return this.adoptionService.findMyAdoptionRequests(userId);
  }

  @Patch(":id")
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.ACCEPTED)
  public async toAccept(@Param("id") adoptionId: string) {
    return await this.adoptionService.toAccept(adoptionId);
  }

  @Delete(":id")
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async toRefuse(@Param("id") adoptionId: string) {
    return await this.adoptionService.deleteAdoptionById(adoptionId);
  }
}

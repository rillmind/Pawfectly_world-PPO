import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Animal } from "src/animal/schemas/animal.schemas";
import { User } from "src/user/schemas/user.schemas";
import { Post_schema_adoption } from "./dto/adoption.dto";
import { Adoption } from "./schema/adoption.schema";

@Injectable()
export class AdoptionService {
  constructor(
    @InjectModel("Adoption")
    private adoptionModel: Model<Adoption>,
    @InjectModel("Animal")
    private animalModel: Model<Animal>
  ) {}

  public async toAdopt(
    post_schema_adoption: Post_schema_adoption,
    adopterId: string
  ): Promise<{
    id: any;
    owner: any;
    adopter: any;
    pet: any;
    descricao: string;
  }> {
    const { owner, pet, descricao } = post_schema_adoption;
    const adoption = await this.adoptionModel.create({
      owner,
      adopter: adopterId,
      pet,
      descricao,
    });
    return { id: adoption._id, pet, owner, adopter: adopterId, descricao };
  }

  public async toAccept(adoptionId: string) {
    const adoption = await this.adoptionModel.findById(adoptionId);
    if (!adoption) throw new NotFoundException("Adoção não encontrada.")
    const petUpdated = this.animalModel.findByIdAndUpdate(
      adoption.pet,
      { dono: adoption.adopter },
      { new: true }
    ).exec();
    return petUpdated;
  }
}

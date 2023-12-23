import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Animal } from "src/animal/schemas/animal.schemas";
import { Post_schema_adoption } from "./dto/adoption.dto";
import { Adoption } from "./schema/adoption.schema";

@Injectable()
export class AdoptionService {
  constructor(
    @InjectModel("Animal")
    private animalModel: Model<Animal>,
    @InjectModel("Adoption")
    private adoptionModel: Model<Adoption>
  ) {}

  public async find() {
    return await this.adoptionModel.find();
  }

  public async findMyAdoptionRequests(userId: string) {
    return await this.adoptionModel.findOne({
      owner: userId,
    });
  }

  public async toAdopt(
    post_schema_adoption: Post_schema_adoption,
    adopterId: string
  ): Promise<{
    id: any;
    pet: any;
    owner: any;
    adopter: any;
    descricao: string;
  }> {
    const { owner, pet, descricao } = post_schema_adoption;
    const adoption = await this.adoptionModel.create({
      pet,
      owner,
      descricao,
      adopter: adopterId,
    });
    if (!adoption) throw new UnprocessableEntityException("Erro de validação.");
    return {
      id: adoption._id,
      pet: adoption.pet,
      adopter: adopterId,
      owner: adoption.owner,
      descricao,
    };
  }

  public async toAccept(adoptionId: string) {
    const adoption = await this.adoptionModel.findById(adoptionId);
    if (!adoption) throw new NotFoundException("Adoção não encontrada.");
    await this.animalModel.findByIdAndUpdate(
      adoption.pet,
      { dono: adoption.adopter },
      { new: true }
    );
    await this.animalModel.findByIdAndUpdate(adoption.pet, {
      $push: { oldOwners: adoption.owner },
    });
  }

  public async deleteAdoptionById(adoptionId: string) {
    const adoption = await this.adoptionModel.findById(adoptionId);
    return await this.adoptionModel.findByIdAndDelete(adoption.id);
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Animal } from "src/animal/schemas/animal.schemas";
import { Post_schema_vacina } from "./dto/vaccination.dto";
import { Vaccination, Vacina } from "./schemas/vaccination.schema";

@Injectable()
export class VaccinationService {
  constructor(
    @InjectModel("Vaccination")
    private vaccinationModel: Model<Vaccination>,
    @InjectModel("Vacina")
    private vacinaModel: Model<Vacina>,
    @InjectModel("Animal")
    private animalModel: Model<Animal>
  ) {}

  public async createVacina(
    post_schema_vacina: Post_schema_vacina,
    petId: Animal
  ) {
    const { data, revacinacao, vacina, nota } = post_schema_vacina;
    const Vacina = await this.vacinaModel.create({
      data,
      nota,
      vacina,
      revacinacao,
    });
    await this.vaccinationModel.find({ pet: petId, $push: { vacina: Vacina } });
    return Vacina;
  }

  public async findVacinaByPetId(petId: Animal) {
    const vacinas = await this.vaccinationModel.find({ pet: petId });
    if (!vacinas) throw new NotFoundException("Vacinas não encontradas.");
    return vacinas;
  }

  public async findVacinaById(vacinaId) {
    const vacina = await this.vacinaModel.findById(vacinaId);
    if (!vacina) throw new NotFoundException("Vacina não encontrada.");
    return vacina;
  }

  public async deleteVacinaById(vacinaId) {
    const vacina = await this.vacinaModel.findByIdAndDelete(vacinaId);
    if (!vacina) throw new NotFoundException("Vacina não encontrada.");
  }
}

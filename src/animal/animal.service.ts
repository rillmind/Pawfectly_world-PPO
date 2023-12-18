import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/schemas/user.schemas";
import { Patch_schema_animal, Post_schema_animal } from "./dto/animal.dto";
import { Animal } from "./schemas/animal.schemas";

@Injectable()
export class AnimalService {
  constructor(
    @InjectModel("Animal")
    private animalModel: Model<Animal>,
    @InjectModel("User")
    private userModel: Model<User>
  ) {}

  public async createAnimal(
    userId: string,
    post_schema_animal: Post_schema_animal
  ): Promise<{ id: any; nome: string; adocao: any; dono: User }> {
    const { nome, idade, tipo, raca, sexo, descricao, adocao } =
      post_schema_animal;
    const user = await this.userModel.findById(userId);
    const animal = await this.animalModel.create({
      nome,
      tipo,
      raca,
      sexo,
      idade,
      adocao,
      descricao,
      dono: user,
    });
    return { id: animal._id, dono: User._id, nome, adocao };
  }

  public async findAll(): Promise<Animal[]> {
    return this.animalModel.find();
  }

  public async findAllByOwner(userId: string): Promise<Animal[]> {
    return await this.animalModel.find({
      dono: userId,
    });
  }

  public async findById(id: string): Promise<Animal> {
    const animal = await this.animalModel.findById(id).exec();
    if (!animal) throw new NotFoundException("Pet não encontrado");
    return animal;
  }

  public async patchById(
    id: string,
    patch_schema_animal: Patch_schema_animal
  ): Promise<Animal> {
    const animal = await this.findById(id);
    if (!animal) throw new NotFoundException("Pet não encontrado");
    Object.assign(animal, patch_schema_animal);
    return await animal.save();
  }

  public async deleteById(id: string): Promise<Animal> {
    const animal = await this.findById(id);
    if (!animal) throw new NotFoundException("Pet não encontrado");
    return await this.animalModel.findByIdAndRemove(id).exec();
  }

  async deleteByIndex(index: number) {
    const animal = await this.animalModel
      .findOne()
      .skip(index - 1)
      .exec();
    if (!animal) throw new NotFoundException("Pet não encontrado");
    await animal.deleteOne();
    return animal;
  }
}

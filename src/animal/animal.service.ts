import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "src/user/schemas/user.schemas";
import { Model } from "mongoose";
import { Animal } from "./schemas/animal.schemas";
import { InjectModel } from "@nestjs/mongoose";
import { Post_schema_animal } from "./DTOs/animal.dto";

@Injectable()
export class AnimalService {
  constructor(
    @InjectModel("Animal")
    private animalModel: Model<Animal>,
    @InjectModel("User")
    private userModel: Model<User>
  ) {}

  public async createAnimal(
    post_schema_animal: Post_schema_animal,
    userId: string
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
    return this.animalModel.find().sort({ createdAt: -1 }).limit(10).exec();
  }

  public async findAllByOwner(userId: string): Promise <Animal[]> {
    const animals = await this.animalModel.find({
      dono: userId
    }).exec();
    return animals;
  } 

  public async findById(id: string): Promise<Animal> {
    try {
      const document = await this.animalModel.findById(id).exec();
      if (!document) {
        throw new NotFoundException(`Document com ID ${id} não encontrado!`);
      }
      return document;
    } catch (error) {
      throw new NotFoundException(`Document com ID ${id} não encontrado!`);
    }
  }

  public async patchById(
    id: string,
    partialUpdate: Partial<Animal>
  ): Promise<Animal> {
    const document = await this.findById(id);
    if (!document) {
      throw new NotFoundException(`Document com ID ${id} não encontrado!`);
    }
    Object.assign(document, partialUpdate);
    const updatedDocument = await document.save();
    return updatedDocument;
  }

  public async deleteById(id: string): Promise<Animal> {
    const document = await this.findById(id);
    if (!document) {
      throw new NotFoundException(`Document com ID ${id} não encontrado!`);
    }
    const deletedDocument = await this.animalModel.findByIdAndRemove(id).exec();
    return deletedDocument;
  }

  async deleteByIndex(index: number): Promise<Animal | null> {
    const animal = await this.animalModel
      .findOne()
      .skip(index - 1)
      .exec();
    if (!animal) {
      return null;
    }
    await animal.deleteOne();
    return animal;
  }
}

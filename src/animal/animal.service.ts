import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Animal } from './schemas/animal.schemas';
import { Post_schema_animal } from './DTOs/animal.dto';

@Injectable()
export class AnimalService {
    constructor(
        @InjectModel('Animal')
        private animalModel: Model<Animal>
    ) { }

    public async createAnimal(post_schema_animal: Post_schema_animal): Promise<{ id: any, dono: string, nome: string, adocao_ativa: any }> {
        const { dono, nome, idade, tipo, raca, sexo, descricao, adocao_ativa } = post_schema_animal
        const animal = await this.animalModel.create({ dono, nome, idade, tipo, raca, sexo, descricao, adocao_ativa })
        return { id: animal._id, dono, nome, adocao_ativa }
    }

    public async findAll(): Promise<Animal[]> {
        return this.animalModel.find()
    }

    public async findById(id: string): Promise<Animal> {
        try {
          const document = await this.animalModel.findById(id).exec()
          if (!document) { throw new NotFoundException(`Document com ID ${id} não encontrado!`) }
          return document
        } 
        catch (error) { throw new NotFoundException(`Document com ID ${id} não encontrado!`) }
      }

      public async patchById(id: string, partialUpdate: Partial<Animal>): Promise<Animal> {
        const document = await this.findById(id)
        if (!document) { throw new NotFoundException(`Document com ID ${id} não encontrado!`) }
        Object.assign(document, partialUpdate)
        const updatedDocument = await document.save()
        return updatedDocument
      }

      public async deleteById(id: string): Promise<Animal> {
        const document = await this.findById(id)
        if (!document) { throw new NotFoundException(`Document com ID ${id} não encontrado!`) }
        const deletedDocument = await this.animalModel.findByIdAndRemove(id).exec()
        return deletedDocument;
      }
}

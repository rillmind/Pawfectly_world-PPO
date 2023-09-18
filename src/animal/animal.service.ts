import { ConflictException, Injectable } from '@nestjs/common';
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
}

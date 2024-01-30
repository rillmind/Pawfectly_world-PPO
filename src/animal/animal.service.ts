import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/schemas/user.schemas";
import { Patch_schema_animal, Post_schema_animal } from "./dto/animal.dto";
import { Animal } from "./schemas/animal.schemas";
import { Posts } from "src/post/schemas/post.schema";
import { Vaccination } from "src/vaccination/schemas/vaccination.schema";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class AnimalService {
  constructor(
    @InjectModel("Vaccination")
    private vaccinationModel: Model<Vaccination>,
    @InjectModel("Animal")
    private animalModel: Model<Animal>,
    @InjectModel("Post")
    private postModel: Model<Posts>,
    @InjectModel("User")
    private userModel: Model<User>
  ) {}

  public async createAnimal(
    userId: string,
    post_schema_animal: Post_schema_animal
  ): Promise<{ id: any; nome: string; adocao: any; dono: User, vac: any }> {
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
    const vaccinationCard = await this.vaccinationModel.create({
      pet: animal._id
    })
    return { id: animal._id, dono: User._id, nome, adocao, vac: vaccinationCard._id };
  }

  public async findAll(): Promise<Animal[]> {
    return this.animalModel.find();
  }

  public async findPetsToAdopt() {
    return await this.animalModel.find({
      adocao: true,
    });
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

  public async getPicByPetId(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException("Usuário não encontrado");
    return user.foto_de_perfil;
  }

  public async patchPetPicById(id: string, file){
    const imageUrl = await this.uploadToSupabase(file);
    const pet = await this.animalModel.findById(id);
    if (!pet) {
      throw new NotFoundException("Usuário não encontrado");
    }
    pet.foto_de_perfil = imageUrl;
    await pet.save();
    return pet;
  }

  private async uploadToSupabase(file) {
    const supabaseURL = process.env.SUPABASE_URL;
    const supabaseKEY = process.env.SUPABASE_KEY;
    const supabase = createClient(supabaseURL, supabaseKEY);
    const uploadPath = `profilePic/${file.originalname}`;
    const { error, data } = await supabase.storage
      .from("profilePic")
      .upload(uploadPath, file.buffer, {
        upsert: true,
      });
    if (error) throw new Error("Erro no upload da imagem");
    return `${supabaseURL}/storage/v1/object/public/profilePic/${uploadPath}`;
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
    const post = await this.postModel.find({
      pet: id,
    });
    console.log(post);
    await this.postModel.findByIdAndDelete(post);
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

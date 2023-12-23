import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/user/schemas/user.schemas";

@Schema({ timestamps: true })
export class Animal extends Document {
  @Prop()
  nome: string;

  @Prop()
  idade: string;

  @Prop()
  tipo: string;

  @Prop()
  raca: string;

  @Prop()
  sexo: string;

  @Prop()
  descricao: string;

  @Prop()
  adocao: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  dono: User;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "User" })
  oldOwners: User;
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);

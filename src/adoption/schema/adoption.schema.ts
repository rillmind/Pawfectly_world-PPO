import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Animal } from "src/animal/schemas/animal.schemas";
import { User } from "src/user/schemas/user.schemas";

@Schema({ timestamps: true })
export class Adoption extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  owner: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  adopter: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Animal" })
  pet: Animal;

  @Prop()
  accepted: boolean;

  @Prop()
  rejected: boolean;

  @Prop()
  descricao: string;
}

export const AdoptionSchema = SchemaFactory.createForClass(Adoption);

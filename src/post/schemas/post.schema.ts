import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Animal } from "src/animal/schemas/animal.schemas";
import { User } from "src/user/schemas/user.schemas";

@Schema({ timestamps: true })
export class Posts extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Animal" })
  pet: Animal;

  @Prop()
  nome: string;

  @Prop()
  username: string;

  @Prop()
  descricao: string;

  @Prop()
  img: string;

  @Prop()
  imgContentType: string;

  @Prop()
  like: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Posts);

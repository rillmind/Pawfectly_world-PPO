import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Animal } from "src/animal/schemas/animal.schemas";
import { User } from "src/user/schemas/user.schemas";

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  usuario: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Animal" })
  animal: Animal;

  @Prop()
  descricao: string;

  @Prop()
  img: string;

  @Prop()
  like: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);

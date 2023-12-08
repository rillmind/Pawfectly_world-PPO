import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "src/auth/enum/roles.enum";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  nome: string;

  @Prop({ unique: [true, "Username já existente!"] })
  @Prop({ required: true })
  username: string;

  @Prop({ unique: [true, "Email já existente!"] })
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  senha: string;

  @Prop({ required: true })
  role: Role;

  @Prop()
  cpf_ou_cnpj: string;

  @Prop()
  telefone: string;

  @Prop()
  data_de_nascimento: string;

  @Prop()
  cep: string;

  @Prop()
  estado: string;

  @Prop()
  cidade: string;

  @Prop()
  bairro: string;

  @Prop()
  rua: string;

  @Prop()
  numero: string;

  static _id: any;
}

export const UserSchema = SchemaFactory.createForClass(User);

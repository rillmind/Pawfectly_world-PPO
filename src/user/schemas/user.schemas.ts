import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  nome: string

  @Prop({ unique: [true, 'Username já existente!'] })
  @Prop({ required: true })
  username: string

  @Prop({ unique: [true, 'Email já existente!'] })
  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  senha: string

  @Prop()
  cpf_ou_cnpj: string

  @Prop()
  telefone: string

  @Prop()
  data_de_nascimento: string

  @Prop({ type: { cep: String, estado: String, cidade: String, bairro: String, rua: String, numero: String, } })
  endereco: {
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
  }
}

export const UserSchema = SchemaFactory.createForClass(User)

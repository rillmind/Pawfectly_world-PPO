import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Animal extends Document {
    @Prop({ required: true })
    dono: string

    @Prop({ required: true })
    nome: string

    @Prop({ required: true })
    idade: string

    @Prop({ required: true })
    tipo: string

    @Prop({ required: true })
    raca: string

    @Prop({ required: true })
    sexo: string

    @Prop()
    descricao: string

    @Prop({ required: true })
    adocao: boolean
}

export const AnimalSchema = SchemaFactory.createForClass(Animal)
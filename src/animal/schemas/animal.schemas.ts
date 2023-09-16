import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Animal extends Document {
    @Prop({ required: true })
    nome: string

    @Prop({ required: true })
    idade: string

    @Prop()
    descricao: string

    @Prop({ required: true})
    type: string
}
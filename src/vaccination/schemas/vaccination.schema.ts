import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Animal } from "src/animal/schemas/animal.schemas";

@Schema({ timestamps: true })
export class Vacina extends Document {
  @Prop()
  data: string;

  @Prop()
  revacinacao: string;

  @Prop()
  vacina: string;

  @Prop()
  nota: string;
}

@Schema({ timestamps: true })
export class Vaccination extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Animal" })
  pet: Animal;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "Vacina", required: false })
  vacina: Vacina;
}

export const VaccinationSchema = SchemaFactory.createForClass(Vaccination);
export const VacinaSchema = SchemaFactory.createForClass(Vacina);

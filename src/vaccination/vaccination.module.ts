import { Module } from "@nestjs/common";
import { VaccinationService } from "./vaccination.service";
import { VaccinationController } from "./vaccination.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { AnimalSchema } from "src/animal/schemas/animal.schemas";
import { AnimalModule } from "src/animal/animal.module";
import {
  VaccinationSchema,
  VacinaSchema,
} from "src/vaccination/schemas/vaccination.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Vaccination", schema: VaccinationSchema },
      { name: "Vacina", schema: VacinaSchema },
      { name: "Animal", schema: AnimalSchema },
    ]),
    AnimalModule,
  ],
  controllers: [VaccinationController],
  providers: [VaccinationService],
})
export class VaccinationModule {}

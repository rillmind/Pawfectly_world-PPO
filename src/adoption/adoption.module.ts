import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AnimalSchema } from "src/animal/schemas/animal.schemas";
import { UserSchema } from "src/user/schemas/user.schemas";
import { UserModule } from "src/user/user.module";
import { AdoptionController } from "./adoption.controller";
import { AdoptionService } from "./adoption.service";
import { AnimalModule } from "src/animal/animal.module";
import { AnimalService } from "src/animal/animal.service";
import { AdoptionSchema } from "./schema/adoption.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Animal", schema: AnimalSchema }]),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    MongooseModule.forFeature([{ name: "Adoption", schema: AdoptionSchema }]),
    UserModule,
    AnimalModule
  ],
  providers: [AnimalService, AdoptionService],
  controllers: [AdoptionController],
})
export class AdoptionModule {}

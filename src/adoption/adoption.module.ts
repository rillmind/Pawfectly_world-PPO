import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AnimalModule } from "src/animal/animal.module";
import { AnimalSchema } from "src/animal/schemas/animal.schemas";
import { UserSchema } from "src/user/schemas/user.schemas";
import { UserModule } from "src/user/user.module";
import { AdoptionController } from "./adoption.controller";
import { AdoptionService } from "./adoption.service";
import { AdoptionSchema } from "./schema/adoption.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    MongooseModule.forFeature([{ name: "Animal", schema: AnimalSchema }]),
    MongooseModule.forFeature([{ name: "Adoption", schema: AdoptionSchema }]),
    AnimalModule,
    UserModule,
  ],
  providers: [AdoptionService],
  controllers: [AdoptionController],
})
export class AdoptionModule {}

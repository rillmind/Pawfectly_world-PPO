import { Module } from "@nestjs/common";
import { AnimalService } from "./animal.service";
import { AnimalController } from "./animal.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { AnimalSchema } from "./schemas/animal.schemas";
import { UserModule } from "src/user/user.module";
import { UserSchema } from "src/user/schemas/user.schemas";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Animal", schema: AnimalSchema }]),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    UserModule,
  ],
  providers: [AnimalService],
  controllers: [AnimalController],
})
export class AnimalModule {}

import { Module } from "@nestjs/common";
import { AnimalService } from "./animal.service";
import { AnimalController } from "./animal.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { AnimalSchema } from "./schemas/animal.schemas";
import { UserModule } from "src/user/user.module";
import { UserSchema } from "src/user/schemas/user.schemas";
import { PostSchema } from "src/post/schemas/post.schema";
import { PostModule } from "src/post/post.module";
import { VaccinationSchema } from "src/vaccination/schemas/vaccination.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Vaccination", schema: VaccinationSchema },
      { name: "Animal", schema: AnimalSchema },
      { name: "User", schema: UserSchema },
      { name: "Post", schema: PostSchema },
    ]),
    UserModule,
    PostModule,
  ],
  providers: [AnimalService],
  controllers: [AnimalController],
})
export class AnimalModule {}

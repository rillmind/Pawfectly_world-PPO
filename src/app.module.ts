import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { AnimalModule } from "./animal/animal.module";
import { MongooseModule } from "@nestjs/mongoose";
import { PostModule } from "./post/post.module";
import { AdoptionModule } from "./adoption/adoption.module";
import { VaccinationModule } from "./vaccination/vaccination.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    MongooseModule.forRoot(process.env.ATLAS_URI),
    AnimalModule,
    UserModule,
    AuthModule,
    PostModule,
    AdoptionModule,
    VaccinationModule,
  ],
})
export class AppModule {}

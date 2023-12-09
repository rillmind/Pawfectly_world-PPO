import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { AnimalModule } from "./animal/animal.module";
import { AdocaoModule } from "./adocao/adocao.module";
import { MongooseModule } from "@nestjs/mongoose";
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AnimalModule,
    AdocaoModule,
    UserModule,
    AuthModule,
    PostModule,
  ],
})
export class AppModule {}

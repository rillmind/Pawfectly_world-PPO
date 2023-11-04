import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/user/schemas/user.schemas";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>("JWT_SECRET"),
          signOptions: {
            expiresIn: config.get<string | number>("JWT_EXPIRES"),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
  ],
  providers: [AuthService],
})
export class AuthModule {}

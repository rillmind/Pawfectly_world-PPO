import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserSchema } from "src/user/schemas/user.schemas";
import { UserModule } from "src/user/user.module";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { UserService } from "src/user/user.service";

@Global()
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
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService],
  exports: [AuthService, AuthModule, LocalStrategy, JwtStrategy, UserService],
})
export class AuthModule {}

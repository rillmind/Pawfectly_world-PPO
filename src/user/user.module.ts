import { Module } from "@nestjs/common";
import { UserSchema } from "./schemas/user.schemas";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./user.controller";
import { UserOwnershipChecker } from "./owner/user.ownershup.checker";

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService, UserOwnershipChecker],
})
export class UserModule {}

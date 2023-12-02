import { IsNotEmpty, IsString } from "class-validator";

export class Post_schema_login {
  @IsNotEmpty()
  @IsString()
  readonly email_ou_username: string;

  @IsNotEmpty()
  @IsString()
  readonly senha: string;
}

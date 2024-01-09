import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class Post_schema_login {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly email_ou_username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly senha: string;
}

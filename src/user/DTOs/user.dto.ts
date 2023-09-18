import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class Post_schema_user {
  @IsNotEmpty()
  @IsString()
  readonly nome: string

  @IsNotEmpty()
  @IsString()
  readonly username: string

  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly senha: string
}
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class post_schema_user {
  @IsNotEmpty()
  @IsString()
  readonly nome: string

  @IsNotEmpty()
  @IsString()
  readonly username: string

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly senha: string
}
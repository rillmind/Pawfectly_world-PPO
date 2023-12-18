import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class Post_schema_user {
  @IsNotEmpty()
  @IsString()
  readonly nome: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly senha: string;
}

export class Patch_schema_data_user {
  @IsString()
  @IsOptional()
  readonly cpf_ou_cnpj?: string;

  @IsString()
  @IsOptional()
  readonly telefone?: string;

  @IsString()
  @IsOptional()
  readonly data_de_nascimento?: string;

  @IsString()
  @IsOptional()
  readonly biografia?: string;

  @IsString()
  @IsOptional()
  readonly cep?: string;

  @IsString()
  @IsOptional()
  readonly estado?: string;

  @IsString()
  @IsOptional()
  readonly cidade?: string;

  @IsString()
  @IsOptional()
  readonly bairro?: string;

  @IsString()
  @IsOptional()
  readonly rua?: string;

  @IsOptional()
  readonly numero?: string;
}

export class UserQueryDto {
  @IsOptional()
  owner: any;
}

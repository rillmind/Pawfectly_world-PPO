import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class Post_schema_user {
  @IsString()
  @IsNotEmpty()
  readonly nome: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly senha: string;
}

export class Patch_schema_user {
  @IsString()
  @IsNotEmpty()
  readonly nome: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly email: string;
}

export class Patch_schema_user_pass {
  @IsString()
  @IsNotEmpty()
  senha: string;
}

export class Patch_schema_user_data {
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

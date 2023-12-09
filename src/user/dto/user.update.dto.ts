import { Type } from "class-transformer";
import { IsEmail, IsString, IsOptional, IsNotEmpty } from "class-validator";

export class Patch_schema_user {
  @IsString()
  @IsNotEmpty()
  readonly nome: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

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

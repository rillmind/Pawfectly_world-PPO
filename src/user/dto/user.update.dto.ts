import { Type } from "class-transformer";
import { IsEmail, IsString, IsOptional, IsNotEmpty } from "class-validator";

export class Patch_schema_user {
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

  @IsOptional()
  @IsString()
  readonly cpf_ou_cnpj?: string;

  @IsOptional()
  @IsString()
  readonly telefone?: string;

  @IsOptional()
  @IsString()
  readonly data_de_nascimento?: string;

  @IsOptional()
  readonly cep: string;

  @IsOptional()
  readonly estado: string;

  @IsOptional()
  readonly cidade: string;

  @IsOptional()
  readonly bairro: string;

  @IsOptional()
  readonly rua: string;

  @IsOptional()
  readonly numero: string;
}

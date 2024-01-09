import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class Post_schema_user {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly nome: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly senha: string;
}

export class Patch_schema_user {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly nome: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;
}

export class Post_schema_user_foto {
  @IsOptional()
  @ApiProperty()
  readonly foto_de_perfil?: any;
}

export class Patch_schema_user_pass {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  senha: string;
}

export class Patch_schema_user_data {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly cpf_ou_cnpj?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly telefone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly data_de_nascimento?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly biografia?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly cep?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly estado?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly cidade?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly bairro?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly rua?: string;

  @IsOptional()
  @ApiProperty()
  readonly numero?: string;
}

export class UserQueryDto {
  @IsOptional()
  owner: any;
}

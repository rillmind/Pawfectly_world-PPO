import { IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "src/user/schemas/user.schemas";

export class Post_schema_animal {
  @IsNotEmpty()
  @IsString()
  readonly nome: string;

  @IsNotEmpty()
  @IsString()
  readonly idade: string;

  @IsNotEmpty()
  @IsString()
  readonly tipo: string;

  @IsNotEmpty()
  @IsString()
  readonly raca: string;

  @IsNotEmpty()
  @IsString()
  readonly sexo: string;

  @IsOptional()
  @IsString()
  readonly descricao: string;

  @IsNotEmpty()
  @IsString()
  readonly adocao: boolean;

  @IsEmpty()
  readonly dono: User;
}

export class Patch_schema_animal {
  @IsString()
  @IsOptional()
  readonly nome?: string;

  @IsString()
  @IsOptional()
  readonly idade?: string;

  @IsString()
  @IsOptional()
  readonly tipo?: string;

  @IsString()
  @IsOptional()
  readonly raca?: string;

  @IsString()
  @IsOptional()
  readonly sexo?: string;

  @IsString()
  @IsOptional()
  readonly descricao?: string;

  @IsString()
  @IsOptional()
  readonly adocao?: boolean;
}


import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "src/user/schemas/user.schemas";

export class Post_schema_animal {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly nome: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly idade: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly tipo: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly raca: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly sexo: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly descricao: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly adocao: boolean;

  @IsEmpty()
  @ApiProperty()
  readonly dono: User;
}

export class Patch_schema_animal {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly nome?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly idade?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly tipo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly raca?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly sexo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly descricao?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly adocao?: boolean;
}


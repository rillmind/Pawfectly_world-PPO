import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class Post_schema_vaccination {
  @IsString()
  readonly pet: string;

  @IsString()
  readonly vacina: string;
}

export class Post_schema_vacina {
  @IsString()
  @IsNotEmpty()
  readonly data: string;

  @IsString()
  @IsNotEmpty()
  readonly revacinacao: string;

  @IsString()
  @IsNotEmpty()
  readonly vacina: string;

  @IsString()
  @IsOptional()
  readonly nota?: string;
}

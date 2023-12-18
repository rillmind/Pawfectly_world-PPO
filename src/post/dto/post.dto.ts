import { IsBoolean, IsOptional, IsString } from "class-validator";

export class Post_schema_post {
  @IsString()
  @IsOptional()
  readonly descricao?: string;

  @IsOptional()
  readonly img?: any;

  @IsString()
  @IsOptional()
  readonly pet?: string;

  @IsBoolean()
  @IsOptional()
  readonly like?: string;
}

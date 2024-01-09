import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class Post_schema_post {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly descricao?: string;

  @IsOptional()
  @ApiProperty()
  readonly img?: any;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly pet?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly like?: string;
}

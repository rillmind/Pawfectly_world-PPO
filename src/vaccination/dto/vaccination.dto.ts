import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class Post_schema_vaccination {
  @IsString()
  @ApiProperty()
  readonly pet: string;

  @IsString()
  @ApiProperty()
  readonly vacina: string;
}

export class Post_schema_vacina {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly data: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly revacinacao: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly vacina: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly nota?: string;
}

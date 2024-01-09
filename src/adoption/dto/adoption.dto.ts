import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class Post_schema_adoption {
    @IsString()
    @ApiProperty()
    readonly owner: string;

    @IsString()
    @ApiProperty()
    readonly adopter: string;

    @IsString()
    @ApiProperty()
    readonly pet: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly descricao?: string;
}
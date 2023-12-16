import { IsOptional, IsString } from "class-validator";

export class Post_schema_adoption {
    @IsString()
    readonly owner: string;

    @IsString()
    readonly adopter: string;

    @IsString()
    readonly pet: string;

    @IsString()
    @IsOptional()
    readonly descricao: string;
}
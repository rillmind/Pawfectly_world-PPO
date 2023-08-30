import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class Post_schema_login {

    @IsNotEmpty()
    @IsString()
    readonly email_ou_username: string
    
    @IsString()
    readonly username: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly senha: string
}
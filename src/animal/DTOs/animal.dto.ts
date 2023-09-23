import { IsNotEmpty, IsString } from "class-validator"

export class Post_schema_animal {
    @IsNotEmpty()
    @IsString()
    readonly dono: string
  
    @IsNotEmpty()
    @IsString()
    readonly nome: string
  
    @IsNotEmpty()
    @IsString()
    readonly idade: string
  
    @IsNotEmpty()
    @IsString()
    readonly tipo: string

    @IsNotEmpty()
    @IsString()
    readonly raca: string
  
    @IsNotEmpty()
    @IsString()
    readonly sexo: string

    @IsString()
    readonly descricao: string
  
    @IsNotEmpty()
    @IsString()
    readonly adocao: boolean
  }
import { Controller, Body, Post, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { Post_schema_animal } from './DTOs/animal.dto';
import { Animal } from './schemas/animal.schemas';

@Controller('animal')
export class AnimalController {
    constructor(private animalService: AnimalService) { }

    @Post('/create')
    @HttpCode(HttpStatus.CREATED)
    public async signUp(@Body() post_schema_animal: Post_schema_animal): Promise<{ nome: string }> {
        return this.animalService.createAnimal(post_schema_animal)
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async findAll(): Promise<Animal[]> {
        return this.animalService.findAll()
    }
}

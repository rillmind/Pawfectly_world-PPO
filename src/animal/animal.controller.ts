import { Controller, Body, Post, HttpCode, HttpStatus, Get, Param, NotFoundException, Patch, Delete } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { Post_schema_animal } from './DTOs/animal.dto';
import { Animal } from './schemas/animal.schemas';

@Controller('animal')
export class AnimalController {
    constructor(private animalService: AnimalService) { }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    public async signUp(@Body() post_schema_animal: Post_schema_animal): Promise<{ nome: string }> {
        return this.animalService.createAnimal(post_schema_animal)
    }

    @Get('list')
    @HttpCode(HttpStatus.OK)
    public async findAll(): Promise<Animal[]> {
        return this.animalService.findAll()
    }

    @Get('find/:id')
    @HttpCode(HttpStatus.OK)
    public async findById(@Param('id') id: string) {
        try {
            const document = await this.animalService.findById(id)
            return document
        } catch (error) {
            throw new NotFoundException(error.message)
        }
    }

    @Patch('update/:id')
    @HttpCode(HttpStatus.OK)
    public async patchById(@Param('id') id: string, @Body() partialUpdate: Partial<Animal>) {
        try {
            const updatedDocument = await this.animalService.patchById(id, partialUpdate)
            return updatedDocument
        } catch (error) {
            throw new NotFoundException(error.message)
        }
    }

    @Delete('delete/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteById(@Param('id') id: string) {
        try {
            const deletedDocument = await this.animalService.deleteById(id)
            return deletedDocument
        }
        catch (error) { throw new NotFoundException(error.message) }
    }
}

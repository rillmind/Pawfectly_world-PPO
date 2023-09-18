import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalSchema } from './schemas/animal.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Animal', schema: AnimalSchema }])],
  providers: [AnimalService],
  controllers: [AnimalController]
})
export class AnimalModule {}

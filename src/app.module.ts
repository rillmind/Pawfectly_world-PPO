import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AnimalModule } from './animal/animal.module';
import { AdocaoModule } from './adocao/adocao.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI_ATLAS),
    UserModule,
    AnimalModule,
    AdocaoModule,
    AuthModule,
  ],
  controllers: [AuthController]
})
export class AppModule { }

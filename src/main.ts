import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cors({
    cors: {
      origin: 'http://localhost:3000',
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      credentials: true,
    },
  }))
  await app.listen(2306);
}
bootstrap();

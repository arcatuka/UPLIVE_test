// backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- CORS Configuration ---
  app.enableCors({
    origin: 'http://localhost:5173', // Replace with your frontend's actual origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you plan to send cookies/authentication headers
  });
  // --- End CORS Configuration ---

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
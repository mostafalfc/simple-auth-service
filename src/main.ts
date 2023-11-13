import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import { createDBIfNotExists } from './config/create-db-if-not-exists';

async function bootstrap() {
  await createDBIfNotExists();
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .addTag('auth')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configuration().app.port, configuration().app.host);
}
bootstrap();

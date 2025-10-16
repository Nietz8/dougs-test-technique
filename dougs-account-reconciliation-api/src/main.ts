import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/global-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Dougs Bank Reconciliation API')
    .setDescription(
      'API for validating bank synchronization integrity. ' +
        'Compares bank operations from external scraping providers with certified balance statements ' +
        'to detect anomalies such as duplicates, missing operations, and balance mismatches. ' +
        'Provides detailed diagnostic information and actionable suggestions for accountants.',
    )
    .setVersion('1.0')
    .addTag(
      'Bank Reconciliation',
      'Endpoints for validating bank data integrity',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/v1`);
}
bootstrap();

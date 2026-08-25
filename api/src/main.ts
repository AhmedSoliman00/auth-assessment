import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  // Use Pino Logger
  app.useLogger(logger);

  // Configure Production-grade CORS
  const clientUrl = configService.get<string>('CLIENT_URL', 'http://localhost:5173');
  app.enableCors({
    origin: [clientUrl],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Setup (Enabled in Dev/Test)
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  if (!isProd) {
    const config = new DocumentBuilder()
      .setTitle('NestJS API')
      .setDescription(
        'Production REST API with MongoDB, JWT Access/Refresh tokens, and Pino Logger',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  logger.log(`Server is running on port: ${port}`);
}
bootstrap();

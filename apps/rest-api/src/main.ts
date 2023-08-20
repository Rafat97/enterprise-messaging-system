import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerFactory } from '@fanout/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: CustomLoggerFactory('rest-api'),
  });
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Messaging')
    .setDescription('The massages API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.disable('x-powered-by');
  app.enableCors();
  app.use(helmet());

  const port = configService.get<number>('APP_PORT', 3000);
  await app.listen(port, '0.0.0.0', async () => {
    console.log(`rest-api Application started on port ${await app.getUrl()}`);
  });
}
bootstrap();

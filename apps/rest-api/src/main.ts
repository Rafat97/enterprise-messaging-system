import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3000);
  await app.listen(port, '0.0.0.0', async () => {
    console.log(`rest-api Application started on port ${await app.getUrl()}`);
  });
}
bootstrap();

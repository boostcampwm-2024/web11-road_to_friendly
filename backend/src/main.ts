import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { CustomWebSocketAdapter } from './common/ws-adapter/custom-web-socket-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.ORIGIN });
  app.useWebSocketAdapter(new CustomWebSocketAdapter(app));
  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();

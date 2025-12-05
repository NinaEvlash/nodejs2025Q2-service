import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  const swaggerDocument = YAML.load(join(__dirname, '..', 'doc', 'api.yaml'));
  app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  await app.listen(port);
}
bootstrap();

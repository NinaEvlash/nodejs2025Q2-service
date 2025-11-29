import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerDocument = YAML.load(join(__dirname, '..', 'doc', 'api.yaml'));

  app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  await app.listen(process.env.PORT || 4000);
}
bootstrap();

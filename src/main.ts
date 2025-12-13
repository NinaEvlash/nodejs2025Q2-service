import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { join } from 'path';
import { AppLoggingService } from './logging/logging.service';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(AppLoggingService);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  const swaggerDocument = YAML.load(join(__dirname, '..', 'doc', 'api.yaml'));
  app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  process.on('uncaughtException', (error) => {
    logger.error('uncaughtException', error);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('unhandledRejection', reason);
  });

  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  await app.listen(port);
}
bootstrap();

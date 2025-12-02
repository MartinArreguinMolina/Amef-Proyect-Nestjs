import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Amef Proyect NestJs')

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.setGlobalPrefix('api/v1')

  // Esto permite que no vengan mas datos en el json cuando se manda la informacion
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Documentacion de la api
  const config = new DocumentBuilder()
    .setTitle('Amef')
    .setDescription('Amef endpoints')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors();
  await app.listen(envs.PORT);
  logger.log(`App running on port ${envs.PORT}`)
}
bootstrap();

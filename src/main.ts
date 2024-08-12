import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataValidationPipe } from './pipes/validation.pipe';
import { HttpExceptionFilter } from './filters/exception-handler.filter';
import { ResponseFormatInterceptor } from './interceptors/response-format.interceptor';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Simple Global Remit')
    .setDescription('Simple Global Remit API Desc')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const options: SwaggerDocumentOptions = {
    // operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new DataValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  await app.listen(3000, () => {
    console.log('Listening to port 3000');
  });
}
bootstrap();

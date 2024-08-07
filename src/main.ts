import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataValidationPipe } from './pipes/validation.pipe';
import { HttpExceptionFilter } from './filters/exception-handler.filter';
import { ResponseFormatInterceptor } from './interceptors/response-format.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new DataValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  await app.listen(3000, () => {
    console.log('Listening to port 3000');
  });
}
bootstrap();

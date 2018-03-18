import {NestFactory} from '@nestjs/core';
import {INestApplication} from '@nestjs/common';
import {ApplicationModule} from './app.module';

async function bootstrap (): Promise<any> {
    const app: INestApplication = await NestFactory.create(ApplicationModule);
    await app.listen(3000);
}

bootstrap();

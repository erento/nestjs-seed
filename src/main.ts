import {NestFactory} from '@nestjs/core';
import {INestApplication} from '@nestjs/common';
import {ApplicationModule} from './app.module';
import {registerBugsnagAndGetFilter} from './utils/bugsnag/bugsnag.helper';
import {Environments} from './environments/environmets';

async function bootstrap (): Promise<any> {
    const app: INestApplication = await NestFactory.create(ApplicationModule);

    app.useGlobalFilters(registerBugsnagAndGetFilter(Environments.getBugsnagKey(), {
        appVersion: Environments.getPackageJson().version,
        releaseStage: 'development',
        packageJSON: JSON.stringify(Environments.getPackageJson()),
    }));

    await app.listen(3000);
}

bootstrap();

import {NestFactory} from '@nestjs/core';
import {INestApplication} from '@nestjs/common';
import {ApplicationModule} from './app.module';
import {registerBugsnagAndGetFilter} from './utils/bugsnag/bugsnag.helper';

// tslint:disable-next-line no-var-requires no-require-imports
const packageJson: string = require('../package.json');

async function bootstrap (): Promise<any> {
    const app: INestApplication = await NestFactory.create(ApplicationModule);

    app.useGlobalFilters(registerBugsnagAndGetFilter('ba375572076032642b24bce412555761', {
        appVersion: packageJson['version'],
        releaseStage: 'development',
        packageJSON: JSON.stringify(packageJson),
    }));

    await app.listen(3000);
}

bootstrap();

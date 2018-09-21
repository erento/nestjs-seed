import {NestFactory} from '@nestjs/core';
import {INestApplication} from '@nestjs/common';
import Axios from 'axios';
import * as uuidv4 from 'uuid/v4';
import * as httpContext from 'express-http-context';
import {REQUEST_UNIQUE_ID_KEY} from './env-const';
import {ApplicationModule} from './app.module';
import {registerBugsnagAndGetFilter} from './utils/bugsnag/bugsnag.helper';
import {Environments} from './environments/environments';
import {CommonModule} from './common/common.module';
import {AuthorizationGuard} from './common/guards/authorization.guard';

Axios.defaults.headers.common['user-agent'] = `x---service-slug---x@${Environments.getVersion()}`;

async function bootstrap (): Promise<any> {
    const app: INestApplication = await NestFactory.create(ApplicationModule);

    app.use(httpContext.middleware);
    app.use((req: {headers: {'user-agent': string}}, _res: object, next: Function): void => {
        let userAgent: string = '--unknown agent--';
        try {
            userAgent = req['headers']['user-agent'] || userAgent;
        } catch {}
        httpContext.set(REQUEST_UNIQUE_ID_KEY, `${uuidv4()} - ${userAgent}`);
        next();
    });

    app.useGlobalFilters(registerBugsnagAndGetFilter(Environments.getBugsnagKey(), {
        appVersion: Environments.getVersion(),
        releaseStage: Environments.getReleaseStage(),
        packageJSON: JSON.stringify(Environments.getPackageJson()),
    }));

    const guard: AuthorizationGuard = app.select<CommonModule>(CommonModule).get<AuthorizationGuard>(AuthorizationGuard);
    app.useGlobalGuards(guard);

    await app.listen(3000);
}

bootstrap();

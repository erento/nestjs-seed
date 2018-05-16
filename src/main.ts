import {NestFactory} from '@nestjs/core';
import {INestApplication} from '@nestjs/common';
import {ApplicationModule} from './app.module';
import {registerBugsnagAndGetFilter} from './utils/bugsnag/bugsnag.helper';
import {Environments} from './environments/environments';
import {CommonModule} from './common/common.module';
import {AuthorizationGuard} from './common/guards/authorization.guard';

async function bootstrap (): Promise<any> {
    const app: INestApplication = await NestFactory.create(ApplicationModule);

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

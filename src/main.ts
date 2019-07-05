import {INestApplication, ShutdownSignal} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import Axios from 'axios';
import * as bodyParser from 'body-parser';
import * as httpContext from 'express-http-context';
import {Server} from 'http';
import * as jsonStringifySafe from 'json-stringify-safe';
import * as uuidv4 from 'uuid/v4';
import {ApplicationModule} from './app.module';
import {AppService} from './app.service';
import {CommonModule} from './common/common.module';
import {AuthorizationGuard} from './common/guards/authorization.guard';
import {ErentoLogger} from './common/logger';
import {BUGSNAG_LOGGER_ENABLED, REQUEST_UNIQUE_ID_KEY, USER_AGENT} from './env-const';
import {Environments} from './environments/environments';
import {BugsnagErrorHandlerFilter} from './utils/bugsnag/bugsnag-error-handler.filter';
import {bugsnagClient, registerBugsnagAndGetFilter} from './utils/bugsnag/bugsnag.helper';

Axios.defaults.headers.common['user-agent'] = USER_AGENT;

const erentoLogger: ErentoLogger = new ErentoLogger();

async function bootstrap (): Promise<any> {
    const app: INestApplication & NestExpressApplication = await NestFactory.create<NestExpressApplication>(ApplicationModule, {
        bodyParser: false,
        logger: erentoLogger,
    });

    app.enableShutdownHooks([
        ShutdownSignal.SIGHUP,
        ShutdownSignal.SIGINT,
        ShutdownSignal.SIGQUIT,
        ShutdownSignal.SIGILL,
        ShutdownSignal.SIGTRAP,
        ShutdownSignal.SIGABRT,
        ShutdownSignal.SIGBUS,
        ShutdownSignal.SIGFPE,
        ShutdownSignal.SIGSEGV,
        ShutdownSignal.SIGTERM,
    ]);

    const bugsnagErrorHandlerFilter: BugsnagErrorHandlerFilter = registerBugsnagAndGetFilter({
        apiKey: Environments.getBugsnagKey(),
        appVersion: Environments.getVersion(),
        releaseStage: Environments.getReleaseStage(),
        packageJSON: jsonStringifySafe(Environments.getPackageJson()),
        logger: BUGSNAG_LOGGER_ENABLED ? {
            debug: erentoLogger.log.bind(erentoLogger),
            info: erentoLogger.log.bind(erentoLogger),
            warn: erentoLogger.warn.bind(erentoLogger),
            error: erentoLogger.error.bind(erentoLogger),
        } : null,
    });

    const middleware: {requestHandler: Function; errorHandler: Function} = bugsnagClient.getPlugin('express');
    app.use(middleware.requestHandler);

    app.use(bodyParser.json());

    app.use(httpContext.middleware);
    app.use((req: {headers: {'user-agent': string}}, _res: object, next: Function): void => {
        let userAgent: string = '--unknown agent--';
        try {
            userAgent = req['headers']['user-agent'] || userAgent;
        } catch {}
        httpContext.set(REQUEST_UNIQUE_ID_KEY, `${uuidv4()} - ${userAgent}`);
        next();
    });

    app.useGlobalFilters(bugsnagErrorHandlerFilter);

    const guard: AuthorizationGuard = app.select<CommonModule>(CommonModule).get<AuthorizationGuard>(AuthorizationGuard);
    app.useGlobalGuards(guard);

    app.use(middleware.errorHandler);

    const server: Server = await app.listen(3000);
    app.get(AppService).setServer(server);
}

bootstrap();

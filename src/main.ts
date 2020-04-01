import {INestApplication, ShutdownSignal} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import Axios from 'axios';
import * as bodyParser from 'body-parser';
import * as httpContext from 'express-http-context';
import {Server} from 'http';
import * as jsonStringifySafe from 'json-stringify-safe';
import {v4 as uuidv4} from 'uuid';
import {ApplicationModule} from './app.module';
import {AppService} from './common/app.service';
import {CommonModule} from './common/common.module';
import {AuthorizationGuard} from './common/guards/authorization.guard';
import {Logger} from './common/logger';
import {BUGSNAG_LOGGER_ENABLED, REQUEST_UNIQUE_ID_KEY, USER_AGENT} from './env-const';
import {Environments} from './environments/environments';
import {BugsnagErrorHandlerFilter} from './utils/bugsnag/bugsnag-error-handler.filter';
import {bugsnagClient, registerBugsnagAndGetFilter} from './utils/bugsnag/bugsnag.helper';

Axios.defaults.headers.common['user-agent'] = USER_AGENT;

const logger: Logger = new Logger();

async function bootstrap (): Promise<any> {
    const app: INestApplication & NestExpressApplication = await NestFactory.create<NestExpressApplication>(ApplicationModule, {
        bodyParser: false,
        logger,
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
            debug: logger.log.bind(logger),
            info: logger.log.bind(logger),
            warn: logger.warn.bind(logger),
            error: logger.error.bind(logger),
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

import {BugsnagClient, BugsnagErrorFilter, Logger} from '@erento/nestjs-common';
import {INestApplication, ShutdownSignal} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import Axios from 'axios';
import * as bodyParser from 'body-parser';
import * as httpContext from 'express-http-context';
import {Server} from 'http';
import {ApplicationModule} from './app.module';
import {AppService} from './common/app.service';
import {USER_AGENT} from './env-const';

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
    const bugsnagClient: BugsnagClient = app.get(BugsnagClient);
    if (!bugsnagClient) {
        throw new Error('BugsnagModule was not imported! Could not resolve BugsnagClient.');
    }

    const bugsnagMiddleware: ReturnType<BugsnagClient['getPlugin']> = bugsnagClient.getPlugin('express');
    if (!bugsnagMiddleware) {
        throw new Error('Bugsnag express plugin missing!');
    }

    app.use(bugsnagMiddleware.requestHandler);
    app.use(bodyParser.json());
    app.use(httpContext.middleware);

    app.useGlobalFilters(new BugsnagErrorFilter(bugsnagClient, logger.error.bind(logger)));

    app.use(bugsnagMiddleware.errorHandler);

    const server: Server = await app.listen(3000);
    app.get(AppService).setServer(server);
}

bootstrap();

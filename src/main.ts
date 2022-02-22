import {Server} from 'http';
import {BugsnagClient, BugsnagErrorFilter, Environments, Logger, runCronJobByName} from '@erento/nestjs-common';
import {start as profilerStart} from '@google-cloud/profiler';
import {start as traceStart} from '@google-cloud/trace-agent';
import {Config} from '@google-cloud/trace-agent/build/src/config';
import {INestApplication, ShutdownSignal} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import Axios from 'axios';
import * as bodyParser from 'body-parser';
import * as httpContext from 'express-http-context';
import {ApplicationModule} from './app.module';
import {AppService} from './common/app.service';
import {CRONJOB_NAME, USER_AGENT} from './env-const';

const gcpMonitoringContext: Config = {
    serviceContext: {
        service: Environments.getPackageJson().name,
        version: Environments.getVersion(),
    },
};

traceStart(gcpMonitoringContext);
profilerStart(gcpMonitoringContext);

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
    const bugsnagClient: BugsnagClient | undefined = app.get(BugsnagClient);
    if (!bugsnagClient) {
        throw new Error('BugsnagModule was not imported! Could not resolve BugsnagClient.');
    }

    if (CRONJOB_NAME) {
        app.get(AppService).onApplicationBootstrap();

        logger.log(`Attempting to run CronJob ${CRONJOB_NAME}`);

        await runCronJobByName(app, CRONJOB_NAME)
            .catch((err: any): void => {
                logger.error(`Failed to execute cron job! Error: ${err?.message}`, err?.stack);
            });

        logger.log(`CronJob finished - exiting`);
        app.close();

        return undefined;
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

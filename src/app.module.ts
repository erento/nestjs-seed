import bugsnagPluginExpress from '@bugsnag/plugin-express';
import {
    BugsnagModule,
    ElapsedTimeMiddleware,
    Environments,
    GlobalLoggerModule,
    Logger,
    RequestMiddleware,
    UniqueIdMiddleware,
} from '@erento/nestjs-common';
import {Module, NestModule} from '@nestjs/common';
import {MiddlewareConsumer} from '@nestjs/common/interfaces';
import {AppController} from './app.controller';
import {CommonModule} from './common/common.module';
import {BUGSNAG_KEY, BUGSNAG_LOGGER_ENABLED} from './env-const';
import {HealthChecksModule} from './health-checks/health-checks.module';

const logger: Logger = new Logger();

@Module({
    imports: [
        BugsnagModule.forRoot({
            apiKey: BUGSNAG_KEY,
            appVersion: Environments.getVersion(),
            releaseStage: Environments.getReleaseStage(),
            plugins: [bugsnagPluginExpress],
            logger: BUGSNAG_LOGGER_ENABLED ? {
                debug: logger.log.bind(logger),
                info: logger.log.bind(logger),
                warn: logger.warn.bind(logger),
                error: logger.error.bind(logger),
            } : null,
        }),
        GlobalLoggerModule,
        CommonModule,
        HealthChecksModule.forRoot(),
    ],
    controllers: [AppController],
})
export class ApplicationModule implements NestModule {
    public configure (consumer: MiddlewareConsumer): void {
        consumer.apply(RequestMiddleware, UniqueIdMiddleware, ElapsedTimeMiddleware).forRoutes('*');
    }
}

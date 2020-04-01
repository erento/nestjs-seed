import {Module, NestModule} from '@nestjs/common';
import {MiddlewareConsumer} from '@nestjs/common/interfaces';
import {AppController} from './app.controller';
import {CommonModule} from './common/common.module';
import {RequestMiddleware} from './common/request-middleware.service';
import {HealthChecksModule} from './health-checks/health-checks.module';

@Module({
    imports: [
        CommonModule,
        HealthChecksModule.forRoot(),
    ],
    controllers: [AppController],
})
export class ApplicationModule implements NestModule {
    public configure (consumer: MiddlewareConsumer): void {
        consumer.apply(RequestMiddleware).forRoutes('*');
    }
}

import {Module, NestModule} from '@nestjs/common';
import {MiddlewareConsumer} from '@nestjs/common/interfaces';
import {AppController} from './app.controller';
import {CommonModule} from './common/common.module';
import {RequestMiddleware} from './common/request-middleware.service';
import {ErentoPathsModule} from './erento-paths/erento-paths.module';

@Module({
    imports: [
        CommonModule,
        ErentoPathsModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [],
})
export class ApplicationModule implements NestModule {
    public configure (consumer: MiddlewareConsumer): void {
        consumer.apply(RequestMiddleware).forRoutes('*');
    }
}

import {MiddlewaresConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {CommonModule} from './common/common.module';
import {RequestMiddelware} from './common/request.middelware';
import {ErentoPathsModule} from './erento-paths/erento-paths.module';

@Module({
    imports: [
        CommonModule,
        ErentoPathsModule.forRoot(),
    ],
    controllers: [AppController],
    components: [],
})
export class ApplicationModule implements NestModule {
    public configure (consumer: MiddlewaresConsumer): void {
        consumer.apply(RequestMiddelware).forRoutes(
            {path: '*', method: RequestMethod.ALL},
        );
    }
}

import {MiddlewaresConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {ErentoPathsModule} from './erento-paths/erento-paths.module';
import {CommonModule} from './common/common.module';
import {RequestMiddelware} from './utils/request.middelware';

// tslint:disable-next-line no-var-requires no-require-imports
const {version}: { version: string } = require('../package.json');

@Module({
    imports: [
        CommonModule,
        ErentoPathsModule.forRoot(version),
    ],
    controllers: [AppController],
    components: [],
})
export class ApplicationModule implements NestModule {
    public configure (consumer: MiddlewaresConsumer): void {
        consumer.apply(RequestMiddelware).with('a').forRoutes(
            {path: '*', method: RequestMethod.ALL},
        );
    }
}

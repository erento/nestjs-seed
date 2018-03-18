import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {ErentoPathsModule} from './erento-paths/erento-paths.module';

@Module({
    imports: [
        ErentoPathsModule,
    ],
    controllers: [AppController],
    components: [],
})
export class ApplicationModule {
}

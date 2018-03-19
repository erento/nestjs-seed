import {DynamicModule, Module} from '@nestjs/common';
import {HealthController} from './health.controller';
import {PingController} from './ping.controller';
import {VersionController} from './version.controller';
import {APP_VERSION} from './providers';

@Module({
    controllers: [HealthController, PingController, VersionController],
})
export class ErentoPathsModule {
    public static forRoot (appVersion: string): DynamicModule {
        return {
            module: ErentoPathsModule,
            components: [
                {provide: APP_VERSION, useValue: appVersion},
            ],
        };
    }
}

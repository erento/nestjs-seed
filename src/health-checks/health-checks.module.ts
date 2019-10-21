import {DynamicModule, Module} from '@nestjs/common';
import {HealthController} from './health.controller';
import {PingController} from './ping.controller';

@Module({
    controllers: [
        HealthController,
        PingController,
    ],
})
export class HealthChecksModule {
    public static forRoot (): DynamicModule {
        return {
            module: HealthChecksModule,
        };
    }
}

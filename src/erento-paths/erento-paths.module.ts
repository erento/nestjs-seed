import {Module} from '@nestjs/common';
import {HealthController} from './health.controller';
import {PingController} from './ping.controller';
import {VersionController} from './version.controller';

@Module({
    controllers: [HealthController, PingController, VersionController],
})
export class ErentoPathsModule {}

import {Global, Module} from '@nestjs/common';
import {ErentoLogger} from './logger';
import {RequestMiddelware} from './request.middelware';
import {AuthorizationGuard} from './guards/authorization.guard';

const components: any[] = [
    AuthorizationGuard,
    ErentoLogger,
    RequestMiddelware,
];

@Global()
@Module({
    imports: [],
    controllers: [],
    components: [...components],
    exports: [...components],
})
export class CommonModule {}

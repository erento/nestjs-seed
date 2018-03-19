import {Global, Module} from '@nestjs/common';
import {ErentoLogger} from './logger';
import {RequestMiddelware} from './request.middelware';

const components: any[] = [
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

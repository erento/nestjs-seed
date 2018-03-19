import {Global, Module} from '@nestjs/common';
import {ErentoLogger} from './logger';

const components: any[] = [
    ErentoLogger,
];

@Global()
@Module({
    imports: [],
    controllers: [],
    components: [...components],
    exports: [...components],
})
export class CommonModule {}

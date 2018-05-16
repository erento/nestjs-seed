import {Global, Module} from '@nestjs/common';
import {ErentoLogger} from './logger';
import {RequestMiddleware} from './request-middleware.service';
import {AuthorizationGuard} from './guards/authorization.guard';

const providers: any[] = [
    AuthorizationGuard,
    ErentoLogger,
    RequestMiddleware,
];

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [...providers],
    exports: [...providers],
})
export class CommonModule {}

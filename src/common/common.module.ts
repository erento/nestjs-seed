import {Global, Module} from '@nestjs/common';
import {AuthorizationGuard} from './guards/authorization.guard';
import {ErentoLogger} from './logger';
import {RequestMiddleware} from './request-middleware.service';

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

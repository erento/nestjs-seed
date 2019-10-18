import {Global, Module} from '@nestjs/common';
import {AuthorizationGuard} from './guards/authorization.guard';
import {Logger} from './logger';
import {RequestMiddleware} from './request-middleware.service';

const providers: any[] = [
    AuthorizationGuard,
    Logger,
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

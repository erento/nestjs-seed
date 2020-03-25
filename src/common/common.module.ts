import {Global, Module} from '@nestjs/common';
import {AppService} from './app.service';
import {AuthorizationGuard} from './guards/authorization.guard';
import {Logger} from './logger';
import {RequestMiddleware} from './request-middleware.service';

const providers: any[] = [
    AppService,
    AuthorizationGuard,
    Logger,
    RequestMiddleware,
];

@Global()
@Module({
    providers: [...providers],
    exports: [...providers],
})
export class CommonModule {}

import {Catch, ExceptionFilter, HttpStatus} from '@nestjs/common';
import {ArgumentsHost} from '@nestjs/common/interfaces/features/arguments-host.interface';
import * as bugsnag from 'bugsnag';
import * as jsonStringifySafe from 'json-stringify-safe';

@Catch()
export class BugsnagErrorHandlerFilter implements ExceptionFilter {
    constructor (private bugsnagService: bugsnag.Bugsnag) {}

    public catch (err: any, host: ArgumentsHost): any {
        const res: any = host.switchToHttp().getResponse();
        const status: any = err && typeof err.getStatus === 'function' ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        console.log('>> status:', status);
        console.log('>> err:', jsonStringifySafe(err)); // Stringify when err message is an object to avoid [object Object] only
        console.log('>> stack:', err.stack);
        this.bugsnagService.notify(err instanceof Error ? err : new Error(err));
        return res.status(status).send({
            err: err.message,
        });
    }
}

import {Catch, ExceptionFilter, HttpStatus} from '@nestjs/common';
import * as bugsnag from 'bugsnag';

@Catch()
export class BugsnagErrorHandlerFilter implements ExceptionFilter {
    constructor (private bugsnagService: bugsnag.Bugsnag) {}

    public catch (err: any, res: any): any {
        const status: any = err && typeof err.getStatus === 'function' ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        console.log('>> status:', status);
        console.log('>> err:', err);
        this.bugsnagService.notify(err instanceof Error ? err : new Error(err));
        return res.status(status).send({
            err: err.message,
        });
    }
}

import {Catch, ExceptionFilter} from '@nestjs/common';
import * as bugsnag from 'bugsnag';

@Catch()
export class BugsnagErrorHandlerFilter implements ExceptionFilter {
    constructor (private b: bugsnag.Bugsnag) {}

    public catch (err: any, res: any): any {
        const status: any = err.getStatus();
        this.b.notify(err instanceof Error ? err : new Error(err));
        return res.status(status).send({
            err: err.message,
        });
    }
}

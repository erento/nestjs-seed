import {Catch, ExceptionFilter, HttpStatus} from '@nestjs/common';
import * as bugsnag from 'bugsnag';

@Catch()
export class BugsnagErrorHandlerFilter implements ExceptionFilter {
    constructor (private b: bugsnag.Bugsnag) {}

    public catch (err: any, res: any): any {
        this.b.notify(err instanceof Error ? err : new Error(err));
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal server error');
    }
}

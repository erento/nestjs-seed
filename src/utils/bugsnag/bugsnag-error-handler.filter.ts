import {Bugsnag} from '@bugsnag/js';
import {Catch, ExceptionFilter, HttpStatus} from '@nestjs/common';
import {ArgumentsHost} from '@nestjs/common/interfaces/features/arguments-host.interface';
import * as httpContext from 'express-http-context';
import * as jsonStringifySafe from 'json-stringify-safe';
import {REQUEST_UNIQUE_ID_KEY} from '../../env-const';
import {clearBreadcrumbs, getBreadcrumbs} from './breadcrumbs';
import {bugsnagClient} from './bugsnag.helper';

@Catch()
export class BugsnagErrorHandlerFilter implements ExceptionFilter {
    public catch (err: any, host: ArgumentsHost): any {
        const res: any = host.switchToHttp().getResponse();
        const status: any = err && typeof err.getStatus === 'function' ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        console.log('>> status:', status);
        console.log('>> err:', jsonStringifySafe(err)); // Stringify when err message is an object to avoid [object Object] only
        console.log('>> stack:', err.stack);
        bugsnagClient.notify(err instanceof Error ? err : new Error(err), {
            severity: 'error',
            context: err.stack,
            metaData: {
                uniqueId: (httpContext.get(REQUEST_UNIQUE_ID_KEY) || 'unknown'),
            },
            beforeSend: (report: Bugsnag.Report): void => {
                if (report.errorClass === 'Error' && Object.keys(err.message || {}).length > 0) {
                    report.errorMessage = err.message.error;
                    report.metaData['reason'] = err.message.reason;
                    report.metaData['breadcrumbs'] = getBreadcrumbs();

                    clearBreadcrumbs();
                }
            },
        });

        return res.status(status).send({
            err: err.message,
        });
    }
}

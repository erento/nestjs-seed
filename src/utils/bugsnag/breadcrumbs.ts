import * as httpContext from 'express-http-context';
import * as moment from 'moment';
import {REQUEST_UNIQUE_ID_BREADCRUMBS_KEY} from '../../env-const';

export function getBreadcrumbs (): Record<string, any> {
    return httpContext.get(REQUEST_UNIQUE_ID_BREADCRUMBS_KEY) || {};
}

export function leaveBreadcrumb (name: string, metaData?: object): void {
    try {
        // currently on 12.4.2019 are breadcrumbs not yet supported in NodeJS, but we are prepared, and currently fall backing to notify
        // bugsnagClient.leaveBreadcrumb(name, metaData);

        const breadcrumbs: Record<string, any> = getBreadcrumbs();
        breadcrumbs[moment().toISOString()] = {
            name,
            metaData,
        };
        httpContext.set(REQUEST_UNIQUE_ID_BREADCRUMBS_KEY, breadcrumbs);
    } catch {}
}

export function clearBreadcrumbs (): void {
    httpContext.set(REQUEST_UNIQUE_ID_BREADCRUMBS_KEY, {});
}

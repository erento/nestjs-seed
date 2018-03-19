import * as bugsnag from 'bugsnag';
import {BugsnagErrorHandlerFilter} from './bugsnag-error-handler.filter';

const getNestFiler: Function = (bugsnagInstance: bugsnag.Bugsnag): BugsnagErrorHandlerFilter => new BugsnagErrorHandlerFilter(
    bugsnagInstance,
);

export enum BugsnagSeverity {
    INFO = 'info',
    WARNING = 'warn',
    ERROR = 'error',
}

export function registerBugsnagAndGetFilter (bugsnagKey: string, bugsnagOptions: bugsnag.ConfigurationOptions): BugsnagErrorHandlerFilter {
    const bugsnagInstance: bugsnag.Bugsnag = bugsnag.register(bugsnagKey, {
        ...{
            logLevel: BugsnagSeverity.WARNING,
            autoNotify: true,
        },
        ...bugsnagOptions,
    });

    return getNestFiler(bugsnagInstance);
}

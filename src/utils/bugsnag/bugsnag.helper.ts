import bugsnag, {Bugsnag} from '@bugsnag/js';
import bugsnagPluginExpress from '@bugsnag/plugin-express';
import {BugsnagErrorHandlerFilter} from './bugsnag-error-handler.filter';

export enum BugsnagSeverity {
    INFO = 'info',
    WARNING = 'warn',
    ERROR = 'error',
}

export let bugsnagClient: Bugsnag.Client;

export function registerBugsnagAndGetFilter (bugsnagOptions: Bugsnag.IConfig): BugsnagErrorHandlerFilter {
    bugsnagClient = bugsnag({
        ...{
            logLevel: BugsnagSeverity.WARNING,
            autoNotify: true,
        },
        ...bugsnagOptions,
    });

    bugsnagClient.use(bugsnagPluginExpress);

    return new BugsnagErrorHandlerFilter(bugsnagOptions && bugsnagOptions.logger ? bugsnagOptions.logger.error : undefined);
}

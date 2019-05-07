import {Injectable} from '@nestjs/common';
import chalk from 'chalk';
import * as httpContext from 'express-http-context';
import {REQUEST_UNIQUE_ID_KEY} from '../env-const';
import {Environments} from '../environments/environments';
import {clearBreadcrumbs, getBreadcrumbs} from '../utils/bugsnag/breadcrumbs';
import {bugsnagClient} from '../utils/bugsnag/bugsnag.helper';

enum LoggerMethod {
    INFO = 'LOG',
    ERROR = 'ERROR',
    WARNING = 'WARN',
}

const dateOptions: Intl.DateTimeFormatOptions = {
    ...{},
    ...(Environments.isProd() ? {timeZone: 'UTC'} : {}),
};

function uniqueIdToHex (str: string): string {
    let hashedNumber: number = 0;
    for (let i: number = 0; i < str.length; i++) {
        // tslint:disable-next-line:no-bitwise
        hashedNumber = str.charCodeAt(i) + ((hashedNumber << 5) - hashedNumber);
    }

    // tslint:disable-next-line:no-bitwise
    const c: string = (hashedNumber & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return '00000'.substring(0, 6 - c.length) + c;
}

const colorMethod: Function = (uniqueId: string): Function => chalk.hex(uniqueIdToHex(uniqueId));

const log: Function = (method: LoggerMethod, uniqueId: string, ...args: string[]): void => {
    /* tslint:disable:no-unbound-method */
    const logMethod: Function = method === LoggerMethod.ERROR ? console.error : (
        method === LoggerMethod.WARNING ? console.warn : console.log
    );
    /* tslint:enable:no-unbound-method */
    const methodColor: Function = method === LoggerMethod.ERROR ? chalk.red.bold : (
        method === LoggerMethod.WARNING ? chalk.yellow.bold : chalk.cyan
    );
    const messageColor: Function = colorMethod(uniqueId);
    logMethod(
        chalk.gray(`${new Date(Date.now()).toLocaleString('en-GB', dateOptions)}`),
        `${methodColor((method + '  ').substr(0, 5))} ${messageColor(uniqueId)}`,
        chalk.white(...args),
    );
};

@Injectable()
export class ErentoLogger {
    public log (...args: string[]): void {
        log(LoggerMethod.INFO, this.getUniqueKey(), ...args);
    }

    public warn (err: any): void {
        const uniqueId: string = this.getUniqueKey();
        const error: Error = err instanceof Error ? err : new Error(err);
        error.message = `${uniqueId}: ${error.message}`;

        bugsnagClient.notify(error, {severity: 'warning', metaData: {uniqueId, ...getBreadcrumbs()}});
        clearBreadcrumbs();
        log(LoggerMethod.WARNING, uniqueId, error.message);
    }

    public error (err: any, trace?: string): void {
        const uniqueId: string = this.getUniqueKey();
        const error: Error = err instanceof Error ? err : new Error(err);
        error.message = `${uniqueId}: ${error.message}`;

        bugsnagClient.notify(error, {severity: 'error', context: trace ? trace : '', metaData: {uniqueId, ...getBreadcrumbs()}});
        clearBreadcrumbs();
        log(LoggerMethod.ERROR, uniqueId, error.message);
    }

    public getUniqueKey (): string {
        return (httpContext.get(REQUEST_UNIQUE_ID_KEY) || 'uniqueID') + ':';
    }
}

import {Injectable} from '@nestjs/common';
import * as bugsnag from 'bugsnag';
import * as cliColor from 'cli-color';
import * as httpContext from 'express-http-context';
import {Environments} from '../environments/environments';
import {REQUEST_UNIQUE_ID_KEY} from '../env-const';

const dateOptions: Intl.DateTimeFormatOptions = {
    ...{},
    ...(Environments.isProd() ? {timeZone: 'UTC'} : {}),
};

let lastUsedColor: Function = cliColor.cyan;

const colorMethod: Function = (): Function => lastUsedColor === cliColor.cyan ? cliColor.magenta : cliColor.cyan;

const log: Function = (uniqueId: string, ...args: string[]): void => {
    console.log(
        uniqueId,
        colorMethod()(`${new Date(Date.now()).toLocaleString('en-GB', dateOptions)}:`),
        cliColor.white(...args),
    );
    lastUsedColor = colorMethod();
};

@Injectable()
export class ErentoLogger {
    public log (...args: string[]): void {
        log(this.getUniqueKey(), ...args);
    }

    public warn (err: any): void {
        const uniqueId: string = this.getUniqueKey();
        const error: Error = err instanceof Error ? err : new Error(err);
        error.message = `${uniqueId}: ${error.message}`;

        bugsnag.notify(error, {severity: 'warning'});
        log(uniqueId, error.message);
    }

    public error (err: any, trace?: string): void {
        const uniqueId: string = this.getUniqueKey();
        const error: Error = err instanceof Error ? err : new Error(err);
        error.message = `${uniqueId}: ${error.message}`;

        bugsnag.notify(error, {severity: 'error', context: trace ? trace : ''});
        log(uniqueId, error.message);
    }

    private getUniqueKey (): string {
        return (httpContext.get(REQUEST_UNIQUE_ID_KEY) || 'uniqueID') + ': ';
    }
}

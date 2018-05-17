import * as bugsnag from 'bugsnag';
import * as cliColor from 'cli-color';
import {Injectable} from '@nestjs/common';
import {Environments} from '../environments/environments';

const dateOptions: Intl.DateTimeFormatOptions = {
    ...{},
    ...(Environments.isProd() ? {timeZone: 'UTC'} : {}),
};

let lastUsedColor: Function = cliColor.cyan;

const colorMethod: Function = (): Function => lastUsedColor === cliColor.cyan ? cliColor.magenta : cliColor.cyan;

const log: Function = (...args: string[]): void => {
    console.log(
        colorMethod()(`${new Date(Date.now()).toLocaleString('en-GB', dateOptions)}:`),
        cliColor.white(...args),
    );
    lastUsedColor = colorMethod();
};

@Injectable()
export class ErentoLogger {
    public log (...args: string[]): void {
        log(...args);
    }

    public warn (err: any): void {
        bugsnag.notify(err instanceof Error ? err : new Error(err), {severity: 'warning'});
        log(err instanceof Error ? err.message : err);
    }

    public error (err: any, trace?: string): void {
        bugsnag.notify(err instanceof Error ? err : new Error(err), {severity: 'error', context: trace ? trace : ''});
        log(err instanceof Error ? err.message : err);
    }
}

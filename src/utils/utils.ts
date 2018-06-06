// tslint:disable typedef

import {UtilsError} from './utils-error';

export const createBuffer = (body: string, encoding: string = 'base64'): Buffer => {
    try {
        return Buffer.from(body, encoding);
    } catch {
        throw new UtilsError('Cannot create a buffer.');
    }
};

export const deepCopyObj = <T>(sourceObj: T): T | undefined => {
    try {
        return JSON.parse(JSON.stringify(sourceObj));
    } catch {
        return undefined;
    }
};

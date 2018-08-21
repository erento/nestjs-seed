// tslint:disable typedef

import {UtilsError} from './utils-error';

interface ES7Array extends Array<any> {
    includes (value: any): boolean;
}

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

// Array.prototype.includes is supported since node@6. It is safe to use it.
export const arrayIntersection = (arr1: any[], arr2: any[]) => arr1.filter(x => (<ES7Array> arr2).includes(x));

export const arrayDifference = (arr1: any[], arr2: any[]) => arr1.filter(x => !(<ES7Array> arr2).includes(x))
    .concat(arr2.filter(x => !(<ES7Array> arr1).includes(x)));

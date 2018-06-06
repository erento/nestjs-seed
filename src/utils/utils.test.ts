import {createBuffer, deepCopyObj} from './utils';

describe('utils', () => {
    describe('buffer', () => {
        test('create', () => {
            const base64: string = 'YWhveQ==';
            const buffer: Buffer | undefined = createBuffer(base64);

            expect(buffer).toBeInstanceOf(Buffer);
            expect(buffer.toString()).toBe('ahoy');
        });

        test('create with wrong data', () => {
            expect(createBuffer('not a base 64')).toBeInstanceOf(Buffer);
            expect(() => createBuffer(<any> null)).toThrowErrorMatchingSnapshot();
            expect(() => createBuffer(<any> undefined)).toThrowErrorMatchingSnapshot();
        });
    });

    describe('object', () => {
        test('copy', () => {
            const objA: any = {a: {a: 1}, b: {b: 1}, c: 1};
            const copy: any = deepCopyObj(objA);
            expect(copy).toMatchSnapshot();
            objA.a.a = 'changed value';
            expect(copy).toMatchSnapshot();
        });

        test('copy not an object', () => {
            expect(deepCopyObj(undefined)).toBeUndefined();
            expect(deepCopyObj(null)).toBeNull();
            expect(deepCopyObj(NaN)).toBeNull();
            expect(deepCopyObj('')).toBe('');
            expect(deepCopyObj('some string')).toBe('some string');
            expect(deepCopyObj(1)).toBe(1);
        });
    });
});

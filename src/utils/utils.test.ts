import {arrayDifference, arrayIntersection, createBuffer, deepCopyObj} from './utils';

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

    describe('array', () => {
        test('difference', (): void => {
            expect(arrayDifference(['a', 'b'], ['b', 'c'])).toEqual(['a', 'c']);
            expect(arrayDifference(['a', 'b'], [])).toEqual(['a', 'b']);
            expect(arrayDifference(['a', 'b'], ['a', 'b'])).toEqual([]);
        });

        test('intersection', (): void => {
            expect(arrayIntersection(['a', 'b'], ['b', 'c'])).toEqual(['b']);
            expect(arrayIntersection(['a', 'b'], ['c', 'd'])).toEqual([]);
            expect(arrayIntersection([{a: 'a'}], [{a: 'a'}])).toEqual([]);

            const value: any = {b: 'b'};
            expect(arrayIntersection(['a', value, 'b'], [value, 'b'])).toEqual([value, 'b']);
        });

        test('intersection is unique', (): void => {
            expect(arrayIntersection(['a', 12], ['c', 12, 'd', 12])).toEqual([12]);
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

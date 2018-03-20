import {ExecutionContext} from '@nestjs/common';
import {AuthorizationGuard} from './authorization.guard';

describe('Authorization Guard', () => {
    it('Should authorize when token is not passed', () => {
        const reflector: any = jest.fn();
        reflector.mockReturnValueOnce(undefined);
        const req: Request = <any> {
            headers: {},
        };
        expect(new AuthorizationGuard({get: reflector}).canActivate(req, <ExecutionContext> {handler: {}})).toBe(true);
    });

    it('Should authorize when token is passed and matches req header', () => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn();
        reflector.mockReturnValueOnce('service');
        expect(new AuthorizationGuard({get: reflector}).canActivate(req, <ExecutionContext> {handler: {}})).toBe(true);
    });

    it('Should authorize when req header is passed but no requirements needed', () => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn().mockReturnValueOnce(undefined);
        expect(new AuthorizationGuard({get: reflector}).canActivate(req, <ExecutionContext> {handler: {}})).toBe(true);
    });

    it('Should not authorize when token does not matches req header', () => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn();
        reflector.mockReturnValueOnce('not matching');
        expect(
            () => new AuthorizationGuard({get: reflector}).canActivate(req, <ExecutionContext> {handler: {}}),
        ).toThrowErrorMatchingSnapshot();
    });

    it('Should not authorize when no req header is passed', () => {
        const req: Request = <any> {
            headers: {},
        };
        const reflector: any = jest.fn();
        reflector.mockReturnValueOnce('not matching');
        expect(
            () => new AuthorizationGuard({get: reflector}).canActivate(req, <ExecutionContext> {handler: {}}),
        ).toThrowErrorMatchingSnapshot();
    });
});

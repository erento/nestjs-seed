import {ExecutionContext} from '@nestjs/common';
import {AuthorizationGuard} from './authorization.guard';

const getExecutionContext: (req: any) => ExecutionContext = (req: any): ExecutionContext => <any> {
    switchToHttp: (): any => {
        return {getRequest: (): any => req};
    },
    handler: {},
};

describe('Authorization Guard', () => {
    it('Should authorize when token is not passed', () => {
        const reflector: any = jest.fn();
        reflector.mockReturnValueOnce(undefined);
        const req: Request = <any> {
            headers: {},
        };
        expect(new AuthorizationGuard({get: reflector}).canActivate(getExecutionContext(req))).toBe(true);
    });

    it('Should authorize when token is passed and matches req header', () => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn();
        reflector.mockReturnValueOnce('service');
        expect(new AuthorizationGuard({get: reflector}).canActivate(getExecutionContext(req))).toBe(true);
    });

    it('Should authorize when token is passed as an array and matches req header', () => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn();
        reflector.mockReturnValueOnce(['x', 'y', 'service', 'z']);
        expect(new AuthorizationGuard({get: reflector}).canActivate(getExecutionContext(req))).toBe(true);
    });

    it('Should authorize when req header is passed but no requirements needed', () => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn().mockReturnValueOnce(undefined);
        expect(new AuthorizationGuard({get: reflector}).canActivate(getExecutionContext(req))).toBe(true);
    });

    it('Should not authorize when token does not matches req header', () => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn();
        reflector.mockReturnValueOnce('not matching');
        expect(() => new AuthorizationGuard({get: reflector}).canActivate(getExecutionContext(req)))
            .toThrowErrorMatchingSnapshot();
    });

    it('Should not authorize when array of tokens does not matches req header', () => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn();
        reflector.mockReturnValueOnce(['not matching', 'not-matching-2']);
        expect(
            () => new AuthorizationGuard({get: reflector}).canActivate(getExecutionContext(req)),
        ).toThrowErrorMatchingSnapshot();
    });

    it('Should not authorize when no req header is passed', () => {
        const req: Request = <any> {
            headers: {},
        };
        const reflector: any = jest.fn();
        reflector.mockReturnValueOnce('not matching');
        expect(() => new AuthorizationGuard({get: reflector}).canActivate(getExecutionContext(req)))
            .toThrowErrorMatchingSnapshot();
    });
});

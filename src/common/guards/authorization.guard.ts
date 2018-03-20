import {CanActivate, ExecutionContext, Guard, HttpException, HttpStatus} from '@nestjs/common';
import {Reflector} from '@nestjs/core';

export const TOKEN: string = 'authToken';
const TOKEN_ROLE_HEADER: string = 'x-token-role';
const DEFAULT_TOKEN_ROLE: string = 'service';

@Guard()
export class AuthorizationGuard implements CanActivate {
    constructor (private readonly reflector: Reflector) {}

    public canActivate (req: Request, context: ExecutionContext): boolean {
        const {handler}: any = context;

        let tokenValue: string = this.reflector.get<string>(TOKEN, handler);
        if (tokenValue === undefined) {
            tokenValue = DEFAULT_TOKEN_ROLE;
        }

        if (req.headers[TOKEN_ROLE_HEADER] !== tokenValue) {
            throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
        }

        return true;
    }
}

import {CanActivate, ExecutionContext, Guard, HttpException, HttpStatus} from '@nestjs/common';
import {Reflector} from '@nestjs/core';

export const TOKEN: string = 'authToken';
const TOKEN_ROLE_HEADER: string = 'x-token-role';

@Guard()
export class AuthorizationGuard implements CanActivate {
    constructor (private readonly reflector: Reflector) {}

    public canActivate (req: Request, context: ExecutionContext): boolean {
        const {handler}: any = context;

        const tokenValue: string = this.reflector.get<string>(TOKEN, handler);

        if (tokenValue === undefined || (tokenValue !== undefined && req.headers[TOKEN_ROLE_HEADER] === tokenValue)) {
            return true;
        }

        throw new HttpException({
            error: 'Not Authorized',
            statusCode: HttpStatus.UNAUTHORIZED,
        }, HttpStatus.UNAUTHORIZED);
    }
}

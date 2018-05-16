import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';

export const TOKEN: string = 'authToken';
const TOKEN_ROLE_HEADER: string = 'x-token-role';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor (private readonly reflector: Reflector) {}

    public canActivate (context: ExecutionContext): boolean {
        const req: Request = context.switchToHttp().getRequest();
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

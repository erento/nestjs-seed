import {Auth, AuthorizationType} from '@erento/nestjs-common';
import {Controller, Get, Post} from '@nestjs/common';

@Controller()
export class AppController {
    @Get('favicon.ico')
    public favicon (): void {}

    @Post('authorization-checker')
    @Auth(AuthorizationType.service)
    public authorizationChecker (): any {
        return 'request authorized';
    }
}

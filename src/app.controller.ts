import {Controller, Post} from '@nestjs/common';
import {Auth} from './common/guards/authorization.decorator';
import {AuthorizationType} from './common/guards/authorization.type';

@Controller()
export class AppController {
    @Post('authorization-checker')
    @Auth(AuthorizationType.service)
    public authorizationChecker (): any {
        return 'request authorized';
    }
}

import {Controller, Get} from '@nestjs/common';
import {PrivateCache} from '../utils/decorator.utils';

@Controller('ping')
export class PingController {
    @Get()
    @PrivateCache()
    public get (): string {
        return 'pong';
    }
}

import {PrivateCache} from '@erento/nestjs-common';
import {Controller, Get} from '@nestjs/common';

@Controller('ping')
export class PingController {
    @Get()
    @PrivateCache()
    public get (): string {
        return 'pong';
    }
}

import {Controller, Get} from '@nestjs/common';

@Controller('ping')
export class PingController {
    @Get()
    public get (): string {
        return 'pong';
    }
}

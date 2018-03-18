import {Controller, Get, HttpCode, HttpStatus} from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    @HttpCode(HttpStatus.NO_CONTENT)
    public root (): void {}
}

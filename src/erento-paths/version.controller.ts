import {Controller, Get, Inject} from '@nestjs/common';
import {APP_VERSION} from './providers';

@Controller('version')
export class VersionController {
    constructor (@Inject(APP_VERSION) private readonly appVersion: string) {}

    @Get()
    public get (): string {
        return this.appVersion;
    }
}

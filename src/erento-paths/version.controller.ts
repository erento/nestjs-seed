import {Controller, Get} from '@nestjs/common';

// tslint:disable-next-line no-var-requires no-require-imports
const {version}: {version: string} = require('../../package.json');

@Controller('version')
export class VersionController {
    @Get()
    public get (): string {
        return version;
    }
}

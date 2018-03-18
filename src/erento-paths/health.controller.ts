import {Controller, Get} from '@nestjs/common';

@Controller('health')
export class HealthController {
    @Get()
    public async get (): Promise<object> {
        return {
            health: await this.isHealthy(),
        };
    }

    private async isHealthy (): Promise<object> {
        return Promise
            .resolve({})
            .then(() => {
                // here can be check for a DB connection, etc.
                return {};
            });
    }
}

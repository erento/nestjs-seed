import {Environments, Logger, PrivateCache} from '@erento/nestjs-common';
import {Controller, Get, HttpException, HttpStatus} from '@nestjs/common';
import axios, {AxiosPromise, AxiosResponse} from 'axios';
import {servicesToPing} from '../../health';

@Controller('health')
export class HealthController {
    constructor (private readonly logger: Logger) {}

    @Get()
    @PrivateCache()
    public async get (): Promise<{environment: string; health: object; version: string}> {
        try {
            return {
                environment: Environments.getEnv(),
                health: await this.isHealthy(),
                version: Environments.getVersion(),
            };
        } catch (e: any) {
            this.logger.error(`Health failed. Original message: "${e.message}".`);
            throw new HttpException(e.message, HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    private async isHealthy (): Promise<any> {
        const responses: AxiosResponse<string>[] = await this.pingServices(servicesToPing);

        return {
            databases: [],
            services: responses.map((response: AxiosResponse<string>): string =>
                `${response.request.res.responseUrl} ${response.data}`),
        };
    }

    private pingServices (serviceNames: string[]): Promise<AxiosResponse<string>[]> {
        const list: AxiosPromise<string>[] = serviceNames.map(
            (service: string): AxiosPromise<string> => axios.get<string>(`http://${service}/ping`),
        );

        return axios.all(list);
    }
}

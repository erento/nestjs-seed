import {Controller, Get, HttpException, HttpStatus} from '@nestjs/common';
// tslint:disable-next-line match-default-export-name
import axios, {AxiosPromise, AxiosResponse} from 'axios';
import {servicesToPing} from '../../health';
import {Environments} from '../environments/environments';

@Controller('health')
export class HealthController {
    @Get()
    public async get (): Promise<{environment: string; health: object; version: string}> {
        try {
            return {
                environment: Environments.getEnv(),
                health: await this.isHealthy(),
                version: Environments.getVersion(),
            };
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    private async isHealthy (): Promise<object> {
        return new Promise<object>(async (resolve: Function, reject: Function): Promise<void> => {
            try {
                const responses: AxiosResponse<string>[] = await this.pingServices(servicesToPing);
                resolve({
                    databases: [],
                    services: responses.map((response: AxiosResponse<string>): string =>
                        `${response.request.res.responseUrl} ${response.data}`),
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    private pingServices (serviceNames: string[]): Promise<AxiosResponse<string>[]> {
        const list: AxiosPromise<string>[] = serviceNames.map(
            (service: string): AxiosPromise<string> => axios.get<string>(`http://${service}/ping`),
        );

        return axios.all(list);
    }
}

import {Logger} from '@erento/nestjs-common';
import {HttpService} from '@nestjs/axios';
import {of} from 'rxjs';
import {HealthController} from './health.controller';
import {PingController} from './ping.controller';

jest.mock('../../health', (): {servicesToPing: any[]} => {
    return {servicesToPing: [
        'user',
    ]};
});

describe('Health Checks', (): void => {
    const logger: Logger = <any> {
        error: jest.fn(),
    };
    const httpService: HttpService = <any> {
        get: jest.fn(),
    };

    it('health', async (): Promise<void> => {
        (<jest.Mock> httpService.get).mockReturnValue(of({
            request: {res: {responseUrl: 'http://user'}},
            data: 'pong',
        }));

        await expect(new HealthController(httpService, logger)
            .get()).resolves.toEqual(
            {
                environment: 'test',
                health: {
                    databases: {},
                    services: [
                        'http://user pong',
                    ],
                },
                version: 'development',
            },
        );
    });

    it('ping', (): void => {
        expect(new PingController()
            .get())
            .toBe('pong');
    });
});

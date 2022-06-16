import {Logger} from '@erento/nestjs-common';
import {HealthController} from './health.controller';
import {PingController} from './ping.controller';

jest.mock('../../health', (): {servicesToPing: any[]} => {
    return {servicesToPing: []};
});

describe('Health Checks', (): void => {
    const logger: Logger = <any> {
        error: jest.fn(),
    };

    it('health', async (): Promise<void> => {
        await expect(new HealthController(logger).get()).resolves.toEqual(
            {
                environment: 'test',
                health: {
                    databases: {},
                    services: [],
                },
                version: 'development',
            },
        );
    });

    it('ping', (): void => {
        expect(new PingController().get()).toBe('pong');
    });
});

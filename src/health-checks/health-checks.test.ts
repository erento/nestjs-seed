import {Logger} from '../common/logger';
import {HealthController} from './health.controller';
import {PingController} from './ping.controller';

jest.mock('../../health', () => {
    return {servicesToPing: []};
});

describe('Health Checks', () => {
    const logger: Logger = <any> {
        error: jest.fn(),
    };

    it('health', async () => {
        await expect(new HealthController(logger).get()).resolves.toEqual(
            {
                environment: 'test',
                health: {
                    databases: [],
                    services: [],
                },
                version: 'development',
            },
        );
    });

    it('ping', () => {
        expect(new PingController().get()).toBe('pong');
    });
});

import {ErentoLogger} from '../common/logger';
import {HealthController} from './health.controller';
import {PingController} from './ping.controller';

jest.mock('../../health', () => {
    return {servicesToPing: []};
});

describe('Erento paths', () => {
    const erentoLogger: ErentoLogger = <any> {
        error: jest.fn(),
    };

    it('health', async () => {
        await expect(new HealthController(erentoLogger).get()).resolves.toEqual(
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

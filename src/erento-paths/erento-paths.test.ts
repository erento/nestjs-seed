import {HealthController} from './health.controller';
import {PingController} from './ping.controller';

describe('Erento paths', () => {
    it('health', async () => {
        await expect(new HealthController().get()).resolves.toEqual(
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

import {PingController} from './ping.controller';
import {HealthController} from './health.controller';

describe('Erento paths', () => {
    it('health', () => {
        expect(new HealthController().get()).resolves.toEqual(
            {
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

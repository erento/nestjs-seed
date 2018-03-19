import {VersionController} from './version.controller';
import {PingController} from './ping.controller';
import {HealthController} from './health.controller';

describe('Erento paths', () => {
    it('health', () => {
        expect(new HealthController().get()).resolves.toEqual({health: {}});
    });

    it('ping', () => {
        expect(new PingController().get()).toBe('pong');
    });

    it('version', () => {
        expect(new VersionController('1.0.0').get()).toBe('1.0.0');
    });
});

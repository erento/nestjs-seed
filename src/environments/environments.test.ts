import {Environments} from './environments';
import {EnvironmentType} from './environment.type';

describe('Environments', () => {
    it('should determine environment correctly', () => {
        const oldEnv: string | undefined = process.env.ENV;

        process.env.ENV = 'undefined-value';
        expect(Environments.getEnv()).toBe(EnvironmentType.DEV);
        expect(Environments.isProd()).toBe(false);
        expect(Environments.isTest()).toBe(false);
        expect(Environments.isDev()).toBe(true);

        process.env.ENV = 'development';
        expect(Environments.getEnv()).toBe(EnvironmentType.DEV);
        expect(Environments.isProd()).toBe(false);
        expect(Environments.isTest()).toBe(false);
        expect(Environments.isDev()).toBe(true);

        process.env.ENV = 'production';
        expect(Environments.getEnv()).toBe(EnvironmentType.PROD);
        expect(Environments.isProd()).toBe(true);
        expect(Environments.isTest()).toBe(false);
        expect(Environments.isDev()).toBe(false);

        process.env.ENV = 'test';
        expect(Environments.getEnv()).toBe(EnvironmentType.TEST);
        expect(Environments.isProd()).toBe(false);
        expect(Environments.isTest()).toBe(true);
        expect(Environments.isDev()).toBe(false);

        process.env.ENV = oldEnv;
    });

    it('should get keys', () => {
        expect(Environments.getBugsnagKey()).toMatchSnapshot();
    });
});

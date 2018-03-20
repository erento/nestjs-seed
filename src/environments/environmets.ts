import {EnvironmentType} from './environment.type';

export class Environments {
    public static getEnv (): EnvironmentType {
        if (process.env.ENV === EnvironmentType.PROD) {
            return EnvironmentType.PROD;
        }

        return process.env.ENV === EnvironmentType.TEST ? EnvironmentType.TEST : EnvironmentType.DEV;
    }

    public static isProd (): boolean {
        return this.getEnv() === EnvironmentType.PROD;
    }

    public static isDev (): boolean {
        return this.getEnv() === EnvironmentType.DEV;
    }

    public static isTest (): boolean {
        return this.getEnv() === EnvironmentType.TEST;
    }

    public static getBugsnagKey (): string {
        return 'ba375572076032642b24bce412555761';
    }

    public static getPackageJson (): any {
        // tslint:disable-next-line no-var-requires no-require-imports
        return require('../../package.json');
    }

    public static getReleaseStage (): EnvironmentType {
        return this.getEnv();
    }

    public static getVersion (): string {
        return process.env.APP_VERSION || EnvironmentType.DEV;
    }
}

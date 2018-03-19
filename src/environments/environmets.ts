import {EnvironmentType} from './environment.type';

export class Environments {
    public static getEnv (): EnvironmentType {
        if (process.env.ENV === EnvironmentType.TEST) {
            return EnvironmentType.TEST;
        }

        return process.env.ENV !== EnvironmentType.PROD ? EnvironmentType.DEV : EnvironmentType.PROD;
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
}

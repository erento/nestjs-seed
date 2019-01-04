import {Environments} from './environments/environments';

export const REQUEST_UNIQUE_ID_KEY: string = 'nestRequestUniqueId';

export const SERVICE_NAME: string = Environments.getPackageJson().name;
export const USER_AGENT: string = `${SERVICE_NAME}@${Environments.getVersion()}`;

// The place for environmental variables from kubernetes secrets.

// EXAMPLE:
// export const DB_USER: string = process.env.DB_USER || '--unknown--';
// export const DB_PASSWORD: string = process.env.DB_PASSWORD || '--unknown--';
// export const DB_NAME: string = process.env.DB_NAME || '--unknown--';
// export const DB_HOST: string = process.env.DB_HOST || '127.0.0.1';

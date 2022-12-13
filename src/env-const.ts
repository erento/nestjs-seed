export const BUGSNAG_KEY: string = 'ba375572076032642b24bce412555761';

export const CRONJOB_NAME: string | undefined = process.env.CRONJOB_NAME;

// The place for environmental variables from kubernetes secrets.

// EXAMPLE:
// export const DB_USER: string = process.env.DB_USER || '--unknown--';
// export const DB_PASSWORD: string = process.env.DB_PASSWORD || '--unknown--';
// export const DB_NAME: string = process.env.DB_NAME || '--unknown--';
// export const DB_HOST: string = process.env.DB_HOST || '127.0.0.1';

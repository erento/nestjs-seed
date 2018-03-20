import {ExpressMiddleware, Middleware, NestMiddleware} from '@nestjs/common';
import {ErentoLogger} from './logger';

/**
 * List of URLs which will be skipped for logging.
 *
 * @type {string[]}
 */
const filteredUrls: string[] = [
    '/favicon.ico',
];

@Middleware()
export class RequestMiddelware implements NestMiddleware {
    constructor (private readonly logger: ErentoLogger) {}

    public async resolve (): Promise<ExpressMiddleware> {
        return async (req: Request, _res: any, next: any): Promise<any> => {
            if (filteredUrls.indexOf(req.url) !== -1) {
                next();
                return undefined;
            }

            this.logger.log(req.url, req.mode);
            next();
        };
    }
}

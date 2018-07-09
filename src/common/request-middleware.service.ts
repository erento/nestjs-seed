import {Injectable, NestMiddleware} from '@nestjs/common';
import {MiddlewareFunction} from '@nestjs/common/interfaces/middleware';
import {ErentoLogger} from './logger';

/**
 * List of URLs which will be skipped for logging.
 *
 * @type {string[]}
 */
const filteredUrls: string[] = [
    '/favicon.ico',
];

interface ExtendedRequest extends Request {
    originalUrl: string;
}

@Injectable()
export class RequestMiddleware implements NestMiddleware {
    constructor (private readonly logger: ErentoLogger) {}

    public async resolve (): Promise<MiddlewareFunction> {
        return async (req: ExtendedRequest, _res: any, next: any): Promise<any> => {
            if (filteredUrls.indexOf(req.url) !== -1) {
                next();
                return undefined;
            }

            this.logger.log(req.originalUrl, req.mode);
            next();
        };
    }
}

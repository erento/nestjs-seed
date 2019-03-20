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
    constructor (private readonly erentoLogger: ErentoLogger) {}

    public async resolve (): Promise<MiddlewareFunction> {
        return async (req: ExtendedRequest, res: any, next: any): Promise<any> => {
            if (filteredUrls.indexOf(req.url) !== -1) {
                next();
                return undefined;
            }

            const startHrTime: [number, number] = process.hrtime();
            res.on('finish', (): void => {
                const elapsedHrTime: [number, number] = process.hrtime(startHrTime);
                const elapsedTimeInMs: number = elapsedHrTime[0] * 1e3 + elapsedHrTime[1] / 1e6;
                this.erentoLogger.log(`Route finished: ${res.statusCode}, execution time ${elapsedTimeInMs}ms`);
            });

            this.erentoLogger.log(`Route started: ${req.method} ${req.originalUrl}`);
            next();
        };
    }
}

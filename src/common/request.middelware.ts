import {ExpressMiddleware, Middleware, NestMiddleware} from '@nestjs/common';
import {ErentoLogger} from './logger';

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
                return;
            }
            this.logger.log(
                req.url,
                req.mode,
                JSON.stringify(req['query']),
                JSON.stringify(req['params']),
            );
            next();
        };
    }
}

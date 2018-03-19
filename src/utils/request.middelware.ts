import {ExpressMiddleware, Middleware, NestMiddleware} from '@nestjs/common';
import {ErentoLogger} from '../common/logger';

@Middleware()
export class RequestMiddelware implements NestMiddleware {
    constructor (private logger: ErentoLogger) {}

    public async resolve (): Promise<ExpressMiddleware> {
        return async (req: Request, _res: any, next: any): Promise<any> => {
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

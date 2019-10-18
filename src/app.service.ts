import {Injectable, OnApplicationBootstrap, OnApplicationShutdown, ShutdownSignal} from '@nestjs/common';
import {Server} from 'http';
import {Logger} from './common/logger';
import {GRACE_PERIOD, SHUTDOWN_TIMEOUT_PERIOD} from './env-const';
import {EnvironmentType} from './environments/environment.type';
import {Environments} from './environments/environments';

@Injectable()
export class AppService implements OnApplicationBootstrap, OnApplicationShutdown {
    private server: Server | undefined;

    constructor (private readonly logger: Logger) {}

    public setServer (server: Server): void {
        this.server = server;
        this.logger.log(`The server was successfully set to shutdown handler.`);
    }

    public onApplicationBootstrap (): void {
        this.logger.log(`Application bootstrapped successfully.`);
    }

    public async onApplicationShutdown (signal: string): Promise<void> {
        this.logger.log(`Application shutdown: The "${signal}" event was fired.`);

        if (ShutdownSignal.SIGINT === signal && Environments.getEnv() === EnvironmentType.DEV) {
            return;
        }

        if (this.server) {
            this.server.close((): void => {
                this.logger.log(`Application shutdown: The server was closed.`);
            });
        }

        return new Promise((res: any): void => {
            let i: number = 0;
            setInterval((): void => {
                this.logger.log(`Application shutdown: Waiting #${++i}`);

                if (i >= GRACE_PERIOD / SHUTDOWN_TIMEOUT_PERIOD) {
                    this.logger.log(`Application shutdown: It should be already safe to exit, resolving!`);
                    res();
                }
            }, SHUTDOWN_TIMEOUT_PERIOD);
        });
    }
}

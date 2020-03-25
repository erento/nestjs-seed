import {Injectable, OnApplicationBootstrap, OnApplicationShutdown, ShutdownSignal} from '@nestjs/common';
import {Server} from 'http';
import {Observable, Subject} from 'rxjs';
import {GRACE_PERIOD, SHUTDOWN_TIMEOUT_PERIOD} from '../env-const';
import {EnvironmentType} from '../environments/environment.type';
import {Environments} from '../environments/environments';
import {Logger} from './logger';

@Injectable()
export class AppService implements OnApplicationBootstrap, OnApplicationShutdown {
    private server: Server | undefined;
    private started: Subject<boolean> = new Subject<boolean>();
    private terminating: Subject<boolean> = new Subject<boolean>();

    constructor (private readonly logger: Logger) {}

    public setServer (server: Server): void {
        this.server = server;
        this.logger.log(`The server was successfully set to shutdown handler.`);
    }

    public onApplicationBootstrap (): void {
        this.started.next(true);
        this.logger.log(`Application bootstrapped successfully.`);
    }

    public async onApplicationShutdown (signal: string): Promise<void> {
        this.logger.log(`Application shutdown: The "${signal}" event was fired.`);
        this.terminating.next(true);

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
            const interval: NodeJS.Timeout = setInterval(async (): Promise<void> => {
                this.logger.log(`Application shutdown: Waiting #${++i}`);

                if (i >= GRACE_PERIOD / SHUTDOWN_TIMEOUT_PERIOD) {
                    this.logger.log(`Closing DB connection.`);
                    try {
                        // here close your DB connections, e.g. as `await UserEntity.sequelize.close();`
                        this.logger.log(`DB connection closed.`);
                    } catch (e) {
                        this.logger.log(`Failed to close DB connection. Original message: "${e && e.message}".`);
                    }

                    this.logger.log(`Application shutdown: It should be already safe to exit, resolving!`);
                    clearInterval(interval);
                    res();
                }
            }, SHUTDOWN_TIMEOUT_PERIOD);
        });
    }

    public hasStarted (): Observable<boolean> {
        return this.started.asObservable();
    }

    public isTerminating (): Observable<boolean> {
        return this.terminating.asObservable();
    }
}

import {Global, Module} from '@nestjs/common';
import {AppService} from './app.service';

const providers: any[] = [
    AppService,
];

@Global()
@Module({
    providers: [...providers],
    exports: [...providers],
})
export class CommonModule {}

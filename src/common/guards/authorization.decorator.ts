import {ReflectMetadata} from '@nestjs/common';
import {TOKEN} from './authorization.guard';

// tslint:disable-next-line variable-name
export const Auth: (tokenValue?: string) => Function = (
    tokenValue: string | undefined = undefined,
): Function => ReflectMetadata(TOKEN, tokenValue);

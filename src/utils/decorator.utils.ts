/* tslint:disable:variable-name */
import {Header} from '@nestjs/common';
type DecoratorFunction = () => MethodDecorator;

export const PrivateCache: DecoratorFunction = (): MethodDecorator =>
    <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): void => {
        Header('Cache-Control', 'private')(target, propertyKey, descriptor);
        Header('Surrogate-Control', 'private')(target, propertyKey, descriptor);
    };

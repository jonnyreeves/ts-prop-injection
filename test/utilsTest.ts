/// <reference path="../typings/mocha/mocha.d.ts" />
import { invokeConstructor } from '../lib/utils';

describe('utils', () => {
    describe('.invokeConstructor', () => {
        it('should return an instance of the supplied Class', () => {
            const result : Target = invokeConstructor<Target>(Target, []);
            if (!(result instanceof Target)) {
                throw new Error('Expected instanceof Target Class');
            }
        });

        it('should invoke the Class\' constructor with the supplied arguments', () => {
            const result : Target = invokeConstructor<Target>(Target, [ 'foo', 'bar' ]);
            if (!(result.ctorArgs.length === 2 &&
                result.ctorArgs[0] === 'foo' &&
                result.ctorArgs[1] === 'bar')) {
                throw new Error('Expected arguments to be supplied to constructor');
            }
        });
    });
});

class Target {
    ctorArgs : Array<any>;

    constructor(...ctorArgs : Array<any>) {
        this.ctorArgs = ctorArgs;
    }
}
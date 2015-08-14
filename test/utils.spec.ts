/// <reference path="../typings/mocha/mocha.d.ts" />
import { invokeConstructor } from '../lib/utils';
import { expect } from 'chai';

describe('utils', () => {
    describe('.invokeConstructor', () => {
        it('should return an instance of the supplied Class', () => {
            const result : Target = invokeConstructor<Target>(Target, []);
            expect(result).to.be.instanceof(Target);
        });

        it('should invoke the Class\' constructor with the supplied arguments', () => {
            const result : Target = invokeConstructor<Target>(Target, [ 'foo', 'bar' ]);
            expect(result.ctorArgs).to.deep.equal([ 'foo', 'bar' ]);
        });
    });
});

class Target {
    ctorArgs : Array<any>;

    constructor(...ctorArgs : Array<any>) {
        this.ctorArgs = ctorArgs;
    }
}
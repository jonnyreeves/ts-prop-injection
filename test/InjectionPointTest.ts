/// <reference path="../typings/mocha/mocha.d.ts" />
import InjectionPoint from '../lib/InjectionPoint';

describe('InjectionPoint', () => {

    describe('#inject', () => {

        it('should inject into a method', () => {
            const target : any = {
                setter(value : string) {
                    this.value = value;
                }
            };

            const point = new InjectionPoint(target, 'setter', [ 'key' ]);
            point.inject([ 'expected' ]);

            if (target.value !== 'expected') {
                throw new Error('Expected value to be injected using method');
            }
        });

        it('should inject multiple arguments into a method', () => {
            const target : any = {
                setter(v1 : string, v2 : string) {
                    this.value1 = v1;
                    this.value2 = v2;
                }
            };

            const point = new InjectionPoint(target, 'setter', [ 'key' ]);
            point.inject([ 'foo', 'bar' ]);

            if (target.value1 !== 'foo' || target.value2 !== 'bar') {
                throw new Error('Expected all values to be injected using method');
            }
        });

        it('should inject into a property if the value is defined', () => {
            const target : any = {};

            const point = new InjectionPoint(target, 'prop', [ 'key' ]);
            point.inject([ 'expected' ]);

            if (target.prop !== 'expected') {
                throw new Error('Expected value to be injected into property');
            }
        });

    });

});
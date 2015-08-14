import { default as InjectionPoint, ConstructorInjectionPoint } from '../lib/InjectionPoint';
import { expect } from 'chai';

describe('InjectionPoint', () => {
    describe('#inject()', () => {
        it('should inject into a method', () => {
            const target : any = {
                setter(value : string) {
                    this.value = value;
                }
            };

            const point = new InjectionPoint(target, 'setter', [ 'key' ]);
            point.inject([ 'expected' ]);

            expect(target.value).to.equal('expected');
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

            expect(target.value1).to.equal('foo');
            expect(target.value2).to.equal('bar');
        });

        it('should inject into a property', () => {
            const target : any = {};

            const point = new InjectionPoint(target, 'prop', [ 'key' ]);
            point.inject([ 'expected' ]);

            expect(target.prop).to.equal('expected');
        });
    });
});

describe('ConstructorInjectionPoint', () => {
    describe('#propertyName', () =>  {
        it('should be constructor', () => {
            const point = new ConstructorInjectionPoint([]);

            expect(point.propertyName).to.equal('constructor');
        });
    });
    describe('#inject()', () => {
        it('should throw when invoked', () => {
            const point = new ConstructorInjectionPoint([]);

            expect(() => { point.inject([ 'expected' ]) }).to.throw();
        });
    });
});
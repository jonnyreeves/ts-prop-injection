/// <reference path="../typings/mocha/mocha.d.ts" />
import Injector from '../lib/Injector';
import inject from '../lib/inject';

describe('Injector', () => {
    var injector : Injector;

    beforeEach(() => {
        injector = new Injector();
    });

    describe('#instantiate()', () => {
        it('should inject into properties that employ the @inject decorator', () => {
            injector.mapValue('firstName', 'Dave');
            const instance = injector.instantiate(PropertyInjectionActor);

            if (instance.prop !== 'Dave') {
                throw new Error('expected value `Dave` to be injected into PropertyInjectionActor#prop');
            }
        });

        it('should inject into setters that employ the @inject decorator', () => {
            injector.mapValue('firstName', 'Dave');
            const instance = injector.instantiate(SetterInjectionActor);

            if (instance.prop !== 'Dave') {
                throw new Error('expected value `Dave` to be injected into SetterInjectionActor#prop');
            }
        });

        it('should inject into constructors that employ the @inject decorator', () => {
            injector.mapValue('firstName', 'Dave');
            const instance = injector.instantiate(CtorInjectionActor);

            if (instance.getProp() !== 'Dave') {
                throw new Error('expected value `Dave` to be injected into CtorInjectionActor()');
            }
        });

        it('should inject into methods that employ the @inject decorator', () => {
            injector.mapValue('firstName', 'Dave');
            const instance = injector.instantiate(MethodInjectionActor);

            if (instance.getProp() !== 'Dave') {
                throw new Error('expected value `Dave` to be injected into MethodInjectionActor#setProp()');
            }
        });

        it('should inject multiple arguments into methos that employ the @inject decorator', () => {
            injector.mapValue('firstName', 'Dave');
            injector.mapValue('lastName', 'Frankenpuss');
            const instance = injector.instantiate(MultiMethodInjectionActor);

            if (instance.fullName !== 'Dave Frankenpuss') {
                throw new Error('expected values `Dave` and `Frankenpuss` to be ' +
                    'injected into MultiMethodInjectionActor#setName() but was ' + instance.fullName);
            }
        });

        it('should not inject into properties that do not employ the @inject decorator', () => {
            injector.mapValue('firstName', 'Dave');
            const instance = injector.instantiate(UnDecoratedActor);

            if (instance.prop !== undefined) {
                throw new Error('expected no injection for UnDecoratedActor#prop');
            }
        });
    })
});

class PropertyInjectionActor {
    @inject('firstName')
    prop : String;
}

class SetterInjectionActor {
    private _prop : string;

    @inject('firstName')
    set prop(value : string) {
        this._prop = value;
    }

    get prop() : string {
        return this._prop;
    }
}

@inject('firstName')
class CtorInjectionActor {
    constructor(private _prop:string) {}

    getProp() : string {
        return this._prop;
    }
}

class MethodInjectionActor {
    private _prop : string;

    @inject('firstName')
    setProp(value : string) : void {
        this._prop = value;
    }

    getProp() : string {
        return this._prop;
    }
}

class MultiMethodInjectionActor {
    private _firstName : string;
    private _lastName : string;

    @inject('firstName', 'lastName')
    setName(first : string, last : string) : void {
        this._firstName = first;
        this._lastName = last;
    }

    get fullName() : string {
        return `${this._firstName} ${this._lastName}`;
    }

    get lastName() : string {
        return this._lastName;
    }
}

class UnDecoratedActor {
    prop : String;
}
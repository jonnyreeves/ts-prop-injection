import Injector from '../lib/Injector';
import inject from '../lib/inject';
import { expect } from 'chai';

describe('Injector', () => {
    var injector : Injector;

    beforeEach(() => {
        injector = new Injector();
        injector.mapValue('firstName', 'Dave');
        injector.mapValue('lastName', 'Grohl');
    });

    describe('#instantiate()', () => {
        it('should inject into properties that employ the @inject decorator', () => {
            const instance = injector.instantiate(PropertyInjectionActor);
            expect(instance.prop).to.equal('Dave');
        });

        it('should inject into setters that employ the @inject decorator', () => {
            const instance = injector.instantiate(SetterInjectionActor);
            expect(instance.prop).to.equal('Dave');
        });

        it('should inject into constructors that employ the @inject decorator', () => {
            const instance = injector.instantiate(CtorInjectionActor);
            expect(instance.getProp()).to.equal('Dave');
        });

        it('should inject into methods that employ the @inject decorator', () => {
            const instance = injector.instantiate(MethodInjectionActor);
            expect(instance.getProp()).to.equal('Dave');
        });

        it('should inject multiple arguments into methods that employ the @inject decorator', () => {
            const instance = injector.instantiate(MultiMethodInjectionActor);
            expect(instance.fullName).to.equal('Dave Grohl');
        });

        it('should not inject into properties that do not employ the @inject decorator', () => {
            const instance = injector.instantiate(UnDecoratedActor);
            expect(instance.prop).to.be.undefined;
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
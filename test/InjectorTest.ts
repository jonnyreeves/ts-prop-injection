/// <reference path="../typings/mocha/mocha.d.ts" />
import Injector from '../lib/Injector';
import inject from '../lib/inject';

describe('Injector', () => {
    var injector : Injector;

    beforeEach(() => {
        injector = new Injector();
    });

    describe('#instantiate', () => {
        it('should inject into properties that employ the @inject decorator', () => {
            injector.mapValue('firstName', 'Dave');
            const instance = injector.instantiate(DecoratedActor);

            if (instance.prop !== 'Dave') {
                throw new Error('expected value `Dave` to be injected into DecoratedActor#prop');
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

class DecoratedActor {
    @inject('firstName')
    prop : String;
}

class UnDecoratedActor {
    prop : String;
}
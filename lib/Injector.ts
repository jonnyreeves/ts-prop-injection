import InjectionPoint from './InjectionPoint';

export default class Injector {

    /**
     * Maps values by their injectionKey.
     *
     * @type {{ string: * }}
     */
    private valuesByInjectionKey : { [ injectionKey : string ] : any } = {};

    /**
     * Associate an injectionKey with a value so that when Injector#instantiate is
     * invoked the supplied value will be injected into properties of the target Class
     * decorated with the `@inject` decorator.
     *
     * @param {string} injectionKey
     * @param {*} value
     */
    mapValue(injectionKey : string, value : any) : void {
        this.valuesByInjectionKey[injectionKey] = value;
    }

    /**
     * Create a new instance of the supplied Class fulfilling any property injections
     * which are present in the injectionRules map.
     *
     * @param {function} Class
     * @returns {T}
     */
    instantiate<T>(Class : { new(...args: any[]) : T }) : T {
        // Start by creating a new instance of the target Class.
        const instance : any = new Class();

        // Loop through all properties decorated with `@inject()` in this Class and
        // try to satisfy them if there is a mapped value.
        for (let injectionPoint of this.getInjectionPoints(Class)) {
            injectionPoint.inject(this.getInjectionValues(injectionPoint));
        }

        return instance;
    }

    private getInjectionPoints<T>(Class : InjectionTarget) : Array<InjectionPoint> {
        return Object.keys(Class.__inject__ || [])
            .map(propertyName => Class.__inject__[propertyName]);
    }

    private getInjectionValues(injectionPoint : InjectionPoint) : Array<any> {
        return injectionPoint.injectionKeys
            .map(key => this.valuesByInjectionKey[key]);
    }
}

export interface InjectionTarget {
    __inject__?: { [ prop : string ] : InjectionPoint };
}
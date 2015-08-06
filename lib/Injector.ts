import InjectionPoint from './InjectionPoint';
import { Constructable, invokeConstructor, CONSTRUCTOR_PROPERTY_NAME } from './utils';

export default class Injector {

    /**
     * Maps values by their injectionKey.
     *
     * @type {{ string: * }}
     */
    private valuesByInjectionKey : { [ injectionKey : string ] : any } = Object.create(null);

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
    instantiate<T>(Class : Constructable<T>) : T {
        // Create an instance of the target Class applying the Constructor InjectionPoint if it has one.
        const instance : T = this.createInjecteeInstance(Class);

        // Apply all remaining InjectionPoints on the instance.
        for (let injectionPoint of this.getInstanceInjectionPoints(Class)) {
            injectionPoint.inject(this.getInjectionValues(injectionPoint));
        }

        return instance;
    }

    /**
     * Return a collection of InjectPoint's from the target Class which should be applied against an instance of
     * the target Class, excludes the Constructor InjectionPoint
     *
     * @param {function} Class
     * @returns {Array<InjectionPoint>}
     */
    private getInstanceInjectionPoints<T>(Class : InjectionTarget) : Array<InjectionPoint> {
        return Object.keys(Class.__inject__ || [])
            .filter(propertyName => propertyName !== CONSTRUCTOR_PROPERTY_NAME)
            .map(propertyName => Class.__inject__[propertyName]);
    }

    /**
     * @param {InjectionPoint} injectionPoint
     * @returns {Array<*>}
     */
    private getInjectionValues(injectionPoint : InjectionPoint) : Array<any> {
        return injectionPoint.injectionKeys
            .map(key => this.valuesByInjectionKey[key]);
    }

    /**
     * Instantiates the supplied Class applying a Constructor InjectionPoint if it has one.
     *
     * @param {function} Class to instantiate.
     * @returns {object} instance of supplied Class
     */
    private createInjecteeInstance<T>(Class : Constructable<T>) : T {
        let result : T;

        if (Class.hasOwnProperty('__inject__')) {
            const injectionPoint : InjectionPoint = (<InjectionTarget> Class).__inject__[CONSTRUCTOR_PROPERTY_NAME];

            if (injectionPoint) {
                result = invokeConstructor(Class, this.getInjectionValues(injectionPoint));
            }
        }

        return result || new Class();
    }
}

/**
 * Identifies an object which carries injection metadata.
 */
export interface InjectionTarget {
    __inject__?: { [ prop : string ] : InjectionPoint };
}
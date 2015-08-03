import InjectionPoint from './InjectionPoint';
import { InjectionTarget } from './Injector';

/**
 * Decorates a Class one or more InjectionPoints via the `__inject__` hash stored
 * directly against the constructor Function.
 *
 * Inject into a property.
 * <pre>
 *     class MyActor {
 *       @inject('firstName')
 *       name : String;
 *     }
 * </pre>
 *
 * Inject into a method.
 * <pre>
 *     class MyActor {
 *       @inject('firstName', 'lastName')
 *       setName(first : string, last : string) { ... }
 *     }
 * </pre>
 *
 * @decorator
 * @param {Array<string>} injectionKeys
 * @returns {function(Object, string): void}
 */
export default function inject(...injectionKeys : Array<string>) {

    // Our decorator provides a factory function which will be invoked with an
    // instance of the decorated Class and the name of the decorated property.
    return function recordInjection(target : Object, decoratedPropertyName : string) : void {

        // Get a reference to the Class of the target object which has been
        // decorated.
        const targetType : InjectionTarget = target.constructor;

        if (!targetType.hasOwnProperty('__inject__')) {
            targetType.__inject__ = {};
        }

        targetType.__inject__[decoratedPropertyName] = new InjectionPoint(
                                        target, decoratedPropertyName, injectionKeys);
    };
}
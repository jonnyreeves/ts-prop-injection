import { default as InjectionPoint, ConstructorInjectionPoint } from './InjectionPoint';
import { InjectionTarget } from './Injector';

/**
 * Decorates a Class one or more InjectionPoints via the `__inject__` hash stored
 * directly against the Class' constructor Function.
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
 * Inject into a Constructor
 * <pre>
 *     @inject('firstName')
 *     class MyActor {
 *       constructor(private firstName : string) {}
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
    return function decoratorFactory(target : Object|Function, decoratedPropertyName? : string) : void {
        let targetType : InjectionTarget;
        let injectionPoint : InjectionPoint;

        // Decorator applied to Class (for Constructor injection).
        if (typeof target === 'function' && decoratedPropertyName === undefined) {
            targetType = target;
            injectionPoint = new ConstructorInjectionPoint(injectionKeys);
        }

        // Decorator applied to member (method or property).
        else if (typeof target === 'object' && typeof decoratedPropertyName === 'string') {
            targetType = target.constructor;
            injectionPoint = new InjectionPoint(target, decoratedPropertyName, injectionKeys);
        }

        // Initialize the injection map if it's not present.
        if (!targetType.hasOwnProperty('__inject__')) {
            targetType.__inject__ = Object.create(null);
        }

        targetType.__inject__[injectionPoint.propertyName] = injectionPoint;
    };
}
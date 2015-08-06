/**
 * Invoke a Constructor function with one or more arguments.
 *
 * @param {function} Class target class to instantiate
 * @param {Array.<*>} args one or more arguments to supply to the constructor.
 * @returns {object} an instance of the supplied Class.
 */
export function invokeConstructor<T>(Class : Constructable<T>, args : Array<any>) : T {
    // Good old pyramid of doom; found almost everywhere we need to invoke a constructor with
    // an unknown number of arguments.
    switch (args.length) {
        case 0: return new Class();
        case 1: return new Class(args[0]);
        case 2: return new Class(args[0], args[1]);
        case 3: return new Class(args[0], args[1], args[2]);
        case 4: return new Class(args[0], args[1], args[2], args[3]);
        case 5: return new Class(args[0], args[1], args[2], args[3], args[4]);
        case 6: return new Class(args[0], args[1], args[2], args[3], args[4], args[5]);
        case 7: return new Class(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        case 8: return new Class(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);

        default:
            throw new Error('Unsupported number of Constructor arguments');
    }
}

/**
 * Identifies an object which we can call `new` on.
 */
export interface Constructable<T> {
    new(...args: any[]) : T;
}

/**
 * Used to identify InjectPoint's which target an instances Constructor.
 *
 * @type {string}
 */
export const CONSTRUCTOR_PROPERTY_NAME = 'constructor';
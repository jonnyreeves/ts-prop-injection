import { CONSTRUCTOR_PROPERTY_NAME } from './utils';

export default class InjectionPoint {
    constructor(
        private _target : any,
        private _propertyName : string,
        private _injectionKeys : Array<string>
    ){}

    get injectionKeys() : Array<string> {
        return this._injectionKeys;
    }

    get propertyName() : string {
        return this._propertyName;
    }

    inject(values : Array<any>) : void {
        if (typeof this._target[this._propertyName] === 'function') {
            this._target[this._propertyName].apply(this._target, values);
        }
        else {
            this._target[this._propertyName] = values[0];
        }
    }
}

/**
 * Specialisation of InjectionPoint to deal with a Constructor's dependencies, note that `#inject()`.
 */
export class ConstructorInjectionPoint extends InjectionPoint{
    constructor(injectionKeys : Array<string>) {
        super(null, CONSTRUCTOR_PROPERTY_NAME, injectionKeys);
    }

    inject(values : Array<any>) : void {
        throw new Error('Unsupported operation #inject()');
    }
}
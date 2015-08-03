export default class InjectionPoint {
    constructor(
        private _target : any,
        private _propertyName : string,
        private _injectionKeys : Array<string>
    ){}

    get injectionKeys() : Array<string> {
        return this._injectionKeys;
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
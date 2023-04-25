// Extensible functiona class
class ExtensibleFunction extends Function {
  constructor(func) {
    super();
    if (!(func instanceof Function)) {
      throw Error('The argument is not a function!');
    }
    return Object.setPrototypeOf(func, new.target.prototype);
  }
}

// Basic class for making of functional objects (= callable objects)
export class FunctionalObject extends ExtensibleFunction {
  // arrow function, no prototype object created
  constructor(func = (...callArgs) => { this.callArgs = callArgs; return this; }) {
    super(func);
  }

  get content() {
    return { callArgs: this.callArgs };
  }
}

// Make callable class with callable instances from simple class
export const makeClassProxy = (classArg, classHandler = {
  apply(TargetClass, thisArg, instanceCreationArgs) {
    return new Proxy(new TargetClass(...instanceCreationArgs), {
      apply(TargetInstance, instanceThis, instanceCallingArgs) {
        return TargetInstance(...instanceCallingArgs);
      },
    });
  },
}) => new Proxy(classArg, classHandler);

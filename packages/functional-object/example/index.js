import { FunctionalObject, makeClassProxy } from '../src/functional-object.js';

class ContainerClass extends FunctionalObject {
  constructor(...instanceArgs) {
    // arrow function, no prototype object created
    super((...callArgs) => { this.callArgs = callArgs; return this; });
    this.instanceArgs = instanceArgs;
  }

  get content() {
    return { instanceArgs: this.instanceArgs, callArgs: this.callArgs };
  }
}

const Container = makeClassProxy(ContainerClass);

const container = Container('a', 'b');
console.log('container: ', container);

console.log('container(\'c\', \'d\').content: ', container('c', 'd').content);
console.log('container: ', container);
console.log('container instanceof Container: ', container instanceof Container);
console.log('container instanceof ContainerClass: ', container instanceof ContainerClass);
console.log('container instanceof FunctionalObject: ', container instanceof FunctionalObject);
console.log('container instanceof Function: ', container instanceof Function);

console.log('container.content: ', container.content);

class ContainerClassProxy extends FunctionalObject {
  #handler = {
    apply(targetInstance, thisArg, instanceCallingArgs) {
      return targetInstance(...instanceCallingArgs);
    },
  };

  constructor(...instanceArgs) {
    // arrow function, no prototype object created
    super((...callArgs) => { this.callArgs = callArgs; return this; });
    this.instanceArgs = instanceArgs;
    return new Proxy(this, this.#handler);
  }

  get content() {
    return { instanceArgs: this.instanceArgs, callArgs: this.callArgs };
  }
}

const Container2 = makeClassProxy(ContainerClassProxy, {
  apply(TargetClass, thisArg, instanceCreationArgs) {
    return new TargetClass(...instanceCreationArgs);
  },
});

const container2 = Container2('a', 'b');
console.log('container2: ', container2);

console.log('container2(\'c\', \'d\').content: ', container2('c', 'd').content);
console.log('container2: ', container2);
console.log('container2 instanceof Container2: ', container2 instanceof Container2);
console.log('container2 instanceof ContainerClassProxy: ', container2 instanceof ContainerClassProxy);
console.log('container2 instanceof FunctionalObject: ', container2 instanceof FunctionalObject);
console.log('container2 instanceof Function: ', container2 instanceof Function);

console.log('container2.content: ', container2.content);

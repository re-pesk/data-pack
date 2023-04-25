import { FunctionalObject, makeClassProxy } from 'functional-object';

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

console.log('container.content: ', container.content);
console.assert(JSON.stringify(container.content) === JSON.stringify({ instanceArgs: ['a', 'b'] }), 'Unexpected container.content');
console.assert(JSON.stringify(container('c', 'd').content) === JSON.stringify({ instanceArgs: ['a', 'b'], callArgs: ['c', 'd'] }), 'Unexpected container.content');
console.log('container.content: ', container.content);

console.assert(container instanceof Container, 'container is not and instance of %s', Container.name);
console.assert(container instanceof ContainerClass, 'container is not and instance of %s', ContainerClass.name);
console.assert(container instanceof FunctionalObject, 'container is not and instance of %s', FunctionalObject.name);
console.assert(container instanceof Function, 'container is not and instance of %s', Function.name);

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
console.log('container2.content: ', container2.content);
console.assert(JSON.stringify(container2.content) === JSON.stringify({ instanceArgs: ['a', 'b'] }), 'Unexpected container2.content');
console.assert(JSON.stringify(container2('c', 'd').content) === JSON.stringify({ instanceArgs: ['a', 'b'], callArgs: ['c', 'd'] }), 'Unexpected container2.content');
console.log('container2.content: ', container2.content);

console.assert(container2 instanceof Container2, 'container is not and instance of %s', Container2.name);
console.assert(container2 instanceof ContainerClassProxy, 'container is not and instance of %s', ContainerClassProxy.name);
console.assert(container2 instanceof FunctionalObject, 'container is not and instance of %s', FunctionalObject.name);
console.assert(container2 instanceof Function, 'container is not and instance of %s', Function.name);

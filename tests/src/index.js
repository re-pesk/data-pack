import { FunctionalObject, makeClassProxy } from 'functional-object';
import { expectClass, expectObject } from 'test-helpers';

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
expectObject(container.content, { instanceArgs: ['a', 'b'] }, 'Unexpected container.content!');

console.log('container: ', container);
expectObject(container('c', 'd').content, { instanceArgs: ['a', 'b'], callArgs: ['c', 'd'] }, 'Unexpected container.content!');
console.log('container: ', container);

expectClass(container, Container, 'container');
expectClass(container, ContainerClass, 'container');
expectClass(container, FunctionalObject, 'container');
expectClass(container, Function, 'container');

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
expectObject(container2.content, { instanceArgs: ['a', 'b'] }, 'Unexpected container2.content!');

console.log('container2: ', container2);
expectObject(container2('c', 'd').content, { instanceArgs: ['a', 'b'], callArgs: ['c', 'd'] }, 'Unexpected container2.content!');
console.log('container2: ', container2);

expectClass(container2, Container2, 'container2');
expectClass(container2, ContainerClassProxy, 'container2');
expectClass(container2, FunctionalObject, 'container2');
expectClass(container2, Function, 'container2');

console.log('container2.content: ', container2.content);

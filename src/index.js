import { FunctionalObject, makeClassProxy } from '../lib/functional-object.js';

const expectObject = (obj, expected, message) => {
  console.assert(obj instanceof Object, 'First argument is not an object!');
  console.assert(expected instanceof Object, 'Second argument must be an object!');
  console.assert(typeof message === 'string', 'Message must be a string!');
  console.assert(JSON.stringify(obj) === JSON.stringify(expected), message);
};

const expectClass = (obj, classArg, name = 'The object') => {
  console.assert(obj instanceof Object, 'First argument is not an object!');
  const constructorStr = classArg.prototype.constructor.toString();
  console.assert(
    constructorStr.match(new RegExp(`^function ${classArg.name}\\(\\) \\{ \\[native code\\] \\}`))
    || constructorStr.match(/^class/),
    'Second argument is not a class!',
  );
  console.assert(typeof name === 'string', 'Name must be a string!');
  console.assert(obj instanceof classArg, `${name} is not an instance of ${classArg.name}!`);
};

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

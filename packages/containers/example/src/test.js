// export class Container extends Map {
//   #handler = {
//     get(target, property, receiver) {
//       if (property.startsWith('$')) {
//         const key = property.slice(1)
//         return target['get'](key);
//       }
//       const result = target[property];
//       if (!(result instanceof Function)) {
//         return result;
//       }
//       return function (...args) {
//         return result.call(this === receiver ? target : this, ...args);
//       };
//     },

//     set(target, property, value, receiver) {
//       if (property.startsWith('$')) {
//         const key = property.slice(1)
//         target['set'](key, value);
//       }
//       return function (...args) {
//         target[property].call(this === receiver ? target : this, ...args);
//       };
//     }
//   };

//   constructor(...constArgs) {
//     super(constArgs);
//     return new Proxy(this, this.#handler);
//   }
// }

const makeClassProxy = (classArg, handler) => new Proxy(classArg, {
  apply(target, thisArg, argumentsList) {
    return new Proxy(new target(...argumentsList), handler);
  }
})

const Container = makeClassProxy(Map, {
  get(target, property, receiver) {
    if (property.startsWith('$')) {
      const key = property.slice(1)
      return target['get'](key);
    }
    const result = target[property];
    if (!(result instanceof Function)) {
      return result;
    }
    return function (...args) {
      return result.call(this === receiver ? target : this, ...args);
    };
  },

  set(target, property, value, receiver) {
    if (property.startsWith('$')) {
      const key = property.slice(1)
      target['set'](key, value);
    }
    return function (...args) {
      target[property].call(this === receiver ? target : this, ...args);
    };
  },

  apply(target, thisArg, argumentsList) {
    target.clear();
    argumentsList.forEach(argument => target.set(...argument));
    return target;
  }
});

const container = Container([['a', 'b'], ['c', 'd']]);

console.log('container: ', container);
// console.log('container instanceof _Container:', container instanceof _Container);
console.log('container instanceof Container:', container instanceof Container);
console.log('container instanceof Map:', container instanceof Map);
console.log(`container.get('a'): `, container.get('a'));
console.log(`container['$a']: `, container['$a']);
container(['e', 'f'], ['g', 'h']);
console.log('container: ', container);

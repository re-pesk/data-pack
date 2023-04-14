import { FunctionalObject, makeClassProxy } from '../functional-object/src/functional-object.js';

// export class TypedMap extends Map {
//   #array = []
//   constructor(arr) {
//     super();
//     arr.forEach((item, i) => {
//       if (!this.has(item)) {
//         this.set(item, [i]);
//         return;
//       }
//       const indexes = this.get(item);
//       indexes.push(i);
//       this.set(item, indexes)
//     });
//     this.#array = arr;
//   }

//   filter(...keys) {
//     const indexes = keys.reduce((arr, key) => [...arr, ...this.get(key)], []);
//     const array = indexes.map(index => [index, this.#array[index]]);
//     return array;
//   }
// }

// export class Container extends Array {
//   #index = new Map();
//   constructor(...args) {
//     super(...args);
//   }

//   nameMaker = (that, id) => {
//     return that[id];
//   }

//   get nameMaker() {
//     return this.nameMaker;
//   }

//   setNameMaker(arg) {
//     if (!(arg instanceof Function)) {
//       throw Error(`Error: the argument must be a function!`);
//     }
//     this.nameMaker = arg;
//     return this;
//   }

//   makeName(that, ...args) {
//     return that.nameMaker(that, ...args);
//   }

//   indexMaker(thisObj) {
//     let names = [], index;
//     index = new Map(
//       thisObj.map((_, i) => {
//         const name = thisObj.makeName(thisObj, i);
//         if (names.includes(name)) {
//           throw Error('Error: duplicated names!');
//         }
//         names.push(name);
//         return [name, i];
//       })
//     );
//     return index;
//   }

//   setIndex(...arr) {
//     const index = this.indexMaker(this, ...arr)
//     this.#index = index;
//     return this;
//   }

//   getNames() {
//     return [...this.#index.keys()];
//   }

//   getIndex() {
//     if (!this.#index) {
//       return undefined;
//     }
//     return new Map(this.#index);
//   }

//   get(key) {
//     if (!this.#index.has(key)) {
//       throw Error(`Index of container has no key "${key}"!`)
//     }
//     return this[this.#index.get(key)];
//   }

//   // add(value, key) {
//   //   if (this.#index)
//   //   if (key) {
//   //     this.push(value);
//   //     this.#names.push(key);
//   //     this.#index.set(key, this.length - 1);
//   //   }
//   // }

//   // replace(value) {
//   //   if (this.#idMap.has(key)) {
//   //     this[this.#idMap.get(key)] = value;
//   //     return this;
//   //   }
//   //   const length = this.push(value);
//   //   this.#idMap.set(key, length - 1);
//   //   return this;
//   // }
// }

// export class Row extends Container {
//   #idMap = new Map();
//   #reIndex() {
//     this.#idMap.clear();
//     this.forEach((item, i) => this.#idMap.set(item, i));
//   }
// }

export class ContainerClass extends FunctionalObject {
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

export const Container = makeClassProxy(ContainerClass, {
  apply(TargetClass, thisArg, instanceCreationArgs) {
    return new TargetClass(...instanceCreationArgs);
  },
});

import { FunctionalObject } from '../../../../lib/functional-object.js';
import { Container, ContainerClass } from '../../src/containers.js';

const container = Container('a', 'b');
console.log('container: ', container);

console.log('container("c", "d").content: ', container('c', 'd').content);
console.log('container: ', container);
console.log('container instanceof Container: ', container instanceof Container);
console.log('container instanceof ContainerClassProxy: ', container instanceof ContainerClass);
console.log('container instanceof FunctionalObject: ', container instanceof FunctionalObject);
console.log('container instanceof Function: ', container instanceof Function);

console.log('container.content: ', container.content);

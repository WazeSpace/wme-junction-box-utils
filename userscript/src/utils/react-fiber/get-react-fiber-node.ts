import { Fiber } from 'react-reconciler';

export function getReactFiberNode(element: Element): Fiber | null {
  const keys = Object.keys(element);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (key.startsWith('__reactFiber$')) return element[key].return;
  }

  return null;
}

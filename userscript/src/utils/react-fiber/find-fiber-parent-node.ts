import { Fiber } from 'react-reconciler';

export function findFiberParentNode(
  currentFiberNode: Fiber,
  predicate: (node: Fiber) => boolean,
): Fiber {
  while (currentFiberNode) {
    if (predicate(currentFiberNode)) return currentFiberNode;
    currentFiberNode = currentFiberNode.return;
  }
  return null;
}

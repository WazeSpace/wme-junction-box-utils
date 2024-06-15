import { Dispatch, SetStateAction } from 'react';
import { Fiber } from 'react-reconciler';
import { getReactFiberNode } from './get-react-fiber-node';

export function getReactFiberState<S>(
  fiber: Fiber,
  predicate: (value: any, index: number) => boolean,
): [S, Dispatch<SetStateAction<S>>] | null {
  let currentStateNode = fiber.memoizedState;
  let currentStateNodeIndex = 0;

  while (currentStateNode) {
    if (!currentStateNode.queue) {
      // probably is a useEffect or something similar, but it's probably not a state
      currentStateNode = currentStateNode.next;
      continue;
    }

    const currentState = currentStateNode.queue.lastRenderedState;
    const dispatchState = currentStateNode.queue.dispatch;
    if (predicate(currentState, currentStateNodeIndex))
      return [currentState, dispatchState];

    currentStateNode = currentStateNode.next;
    currentStateNodeIndex++;
  }

  return null;
}

export function getReactFiberStateByDomElement<S>(
  element: Element,
  predicate: (value: any, index: number) => boolean,
) {
  const fiberNode = getReactFiberNode(element);
  if (!fiberNode) return null;
  return getReactFiberState<S>(fiberNode, predicate);
}

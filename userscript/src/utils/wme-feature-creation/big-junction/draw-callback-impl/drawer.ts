import { findFiberParentNode, getReactFiberNode } from '@/utils/react-fiber';
import { RefObject } from 'react';
import { Fiber } from 'react-reconciler';

function getDrawBigJunctionMenuItem(): Element {
  const element = document
    .getElementById('drawer')
    .querySelector(
      '[class^=menu] wz-menu-item:has(i.w-icon.w-icon-intersection)',
    );
  if (!element) throw new Error('DrawBigJunction menu item is not found');
  return element;
}

function getDrawBigJunctionMenuItemFiber(): Fiber {
  const element = getDrawBigJunctionMenuItem();

  const fiber = getReactFiberNode(element);
  if (!fiber)
    throw new Error('DrawBigJunction menu-item fiber is not available');
  return fiber;
}

function isRefObject<T>(
  obj: any,
  assertion: (value: any) => boolean,
): obj is RefObject<T> {
  return (
    typeof obj === 'object' &&
    obj.hasOwnProperty('current') &&
    assertion(obj.current)
  );
}

function isMemoHook<T>(
  rawState: any,
  assertion: (value: any) => boolean,
): rawState is [T, any] {
  return (
    Array.isArray(rawState) &&
    rawState.length === 2 &&
    Array.isArray(rawState[1]) &&
    assertion(rawState[0])
  );
}

function findInfoInRawState<T>(
  rawState: any,
  assertion: (value: any) => boolean,
): [true, T] | [false, null] {
  if (isRefObject<T>(rawState, assertion)) {
    return [true, rawState.current];
  }

  if (isMemoHook<T>(rawState, assertion)) {
    return [true, rawState[0]];
  }

  return [false, null];
}

function findDrawControlInFiberNode(fiberNode: Fiber) {
  let currentStateRef = fiberNode.memoizedState;
  while (currentStateRef) {
    const currentState = currentStateRef.memoizedState;
    const [success, value] = findInfoInRawState<{ drawCallback: any }>(
      currentState,
      (value) =>
        typeof value === 'object' &&
        value.__proto__.hasOwnProperty('CLASS_NAME') &&
        value.__proto__.CLASS_NAME === 'Waze.Control.DrawFeature' &&
        typeof value.drawCallback === 'function',
    );
    if (success) return value;

    currentStateRef = currentStateRef.next;
  }

  return null;
}

export default function getBigJunctionDrawCallback() {
  const menuItemFiber = getDrawBigJunctionMenuItemFiber();
  const menuItemHOCFiber = findFiberParentNode(
    menuItemFiber,
    (node) => !!findDrawControlInFiberNode(node),
  );
  if (!menuItemHOCFiber)
    throw new Error('DrawBigJunction HOC fiber is not available');

  return findDrawControlInFiberNode(menuItemHOCFiber).drawCallback;
}

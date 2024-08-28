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

function findDrawControlInFiberNode(fiberNode: Fiber) {
  let currentStateRef = fiberNode.memoizedState;
  while (currentStateRef) {
    const currentState = currentStateRef.memoizedState;
    if (
      isRefObject<{ drawCallback: any }>(
        currentState,
        (refValue) =>
          typeof refValue === 'object' &&
          refValue.__proto__.hasOwnProperty('CLASS_NAME') &&
          refValue.__proto__.CLASS_NAME === 'Waze.Control.DrawFeature' &&
          typeof refValue.drawCallback === 'function',
      )
    ) {
      return currentState.current;
    }

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

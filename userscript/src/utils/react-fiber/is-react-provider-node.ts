import { ReactNode } from 'react';
import { Fiber } from 'react-reconciler';

interface ContextProviderFiber<T> extends Fiber {
  memoizedProps: {
    children: ReactNode;
    value: T;
  };
  pendingProps: {
    children: ReactNode;
    value: T;
  };
}
export function isReactProviderNode<T = any>(
  node: Fiber,
): node is ContextProviderFiber<T> {
  return (
    node.elementType &&
    typeof node.elementType === 'object' &&
    node.elementType.hasOwnProperty('$$typeof') &&
    node.elementType.hasOwnProperty('_context') &&
    node.elementType['$$typeof'].toString() === 'Symbol(react.provider)'
  );
}

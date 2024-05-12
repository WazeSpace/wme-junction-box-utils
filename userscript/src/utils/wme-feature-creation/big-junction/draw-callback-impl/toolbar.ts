import { findFiberParentNode, getReactFiberNode } from '@/utils/react-fiber';
import { Fiber } from 'react-reconciler';

function getDrawBigJunctionButton(): Element {
  const element = document.querySelector(
    '#toolbar .toolbar-collection-component .toolbar-group-drawing wz-menu .toolbar-group-item.junction-box wz-button.polygon',
  );
  if (!element) throw new Error('DrawBigJunction button is not found');
  return element;
}

function getDrawBigJunctionButtonFiber(): Fiber {
  const element = getDrawBigJunctionButton();

  const fiber = getReactFiberNode(element);
  if (!fiber) throw new Error('DrawBigJunction button fiber is not available');
  return fiber;
}

function getToolbarItemFiber(): Fiber {
  const drawBigJunctionButtonFiber = getDrawBigJunctionButtonFiber();
  const toolbarFiber = findFiberParentNode(
    drawBigJunctionButtonFiber,
    (fiberNode) =>
      'model' in fiberNode.memoizedProps &&
      'attributes' in fiberNode.memoizedProps.model &&
      fiberNode.memoizedProps.model.attributes.toolbarMenuItemClass ===
        'junction-box' &&
      'control' in fiberNode.memoizedProps.model.attributes,
  );
  if (!toolbarFiber)
    throw new Error('DrawBigJunction toolbar item fiber is not available');
  return toolbarFiber;
}

export default function getBigJunctionDrawCallback() {
  const toolbarItemFiber = getToolbarItemFiber();
  const drawCallback =
    toolbarItemFiber.memoizedProps.model?.attributes?.control?.drawCallback;
  if (!drawCallback)
    throw new Error('BigJunctionToolbarItem drawCallback is not available');

  return drawCallback;
}

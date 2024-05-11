import { findFiberParentNode, getReactFiberNode } from '@/utils/react-fiber';

function getDrawBigJunctionPolygonButton() {
  return document.querySelector(
    '#toolbar .toolbar-collection-component .toolbar-group-drawing wz-menu .toolbar-group-item.junction-box wz-button.polygon',
  );
}

function getDrawBigJunctionPolygonButtonFiber() {
  const drawPolygonButton = getDrawBigJunctionPolygonButton();
  if (!drawPolygonButton) return null;

  return getReactFiberNode(drawPolygonButton);
}

function getFiberNodeOfBigJunctionToolbarItem() {
  const drawPolygonButtonFiber = getDrawBigJunctionPolygonButtonFiber();
  if (!drawPolygonButtonFiber) return null;

  return findFiberParentNode(
    drawPolygonButtonFiber.alternate ?? drawPolygonButtonFiber,
    (node) =>
      'model' in node.memoizedProps &&
      'attributes' in node.memoizedProps.model &&
      node.memoizedProps.model.attributes.toolbarMenuItemClass ===
        'junction-box' &&
      'control' in node.memoizedProps.model.attributes,
  );
}

export function getDrawBigJunctionHandler() {
  const toolbarFiber = getFiberNodeOfBigJunctionToolbarItem();
  return toolbarFiber.memoizedProps.model.attributes.control.drawCallback;
}

import { useMutationObserver } from '@/hooks';
import {
  findLaneGuidanceContainerByDirection,
  findLaneGuidanceControlModelByLanesControl,
  findLaneGuidanceEditRegionContainer,
  isLanesControlElement,
} from '../utils';
import { useMemo, useState } from 'react';
import { isElementNode } from '@/utils/dom-node';

function findLanesControlNodeInList(nodeList: NodeList): Element {
  return Array.prototype.find.call(
    nodeList,
    (node: Node) => isElementNode(node) && isLanesControlElement(node),
  );
}

export function useLaneGuidanceControlElement(
  lanesDirection: 'fwd' | 'rev',
): Element {
  const laneGuidanceContainer =
    findLaneGuidanceContainerByDirection(lanesDirection);
  const editRegionContainer = findLaneGuidanceEditRegionContainer(
    laneGuidanceContainer,
  );

  const [lanesControlElement, setLanesControlElement] = useState<Element>(null);

  useMutationObserver(
    editRegionContainer,
    ([mutation]) => {
      const addedNode = findLanesControlNodeInList(mutation.addedNodes);
      const removedNode = findLanesControlNodeInList(mutation.removedNodes);

      const isAdded = addedNode && !removedNode;
      const isRemoved = !addedNode && removedNode;
      const isChanged = isAdded || isRemoved;
      if (!isChanged) return;
      setLanesControlElement(isAdded ? addedNode : null);
    },
    { childList: true },
  );

  return lanesControlElement;
}

export function useLaneGuidanceControl(lanesDirection: 'fwd' | 'rev') {
  const lanesControlElement = useLaneGuidanceControlElement(lanesDirection);

  return useMemo(
    () => findLaneGuidanceControlModelByLanesControl(lanesControlElement),
    [lanesControlElement],
  );
}
